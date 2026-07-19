import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    let key = "";
    try {
      const envPath = path.join(process.cwd(), ".env");
      const envContent = fs.readFileSync(envPath, "utf8");
      const match = envContent.match(/GROQ_API_KEY\s*=\s*(gsk_[a-zA-Z0-9]+)/);
      if (match) {
        key = match[1].trim();
      }
    } catch (e) {
      console.warn("Could not read .env file directly, falling back to process.env");
    }
    
    if (!key) {
      key = process.env.GROQ_API_KEY?.trim() || "";
    }
    
    const groq = new Groq({
      apiKey: key,
    });
    
    const { question, annualIncome, householdSize } = await req.json();

    if (!question || annualIncome === undefined || householdSize === undefined) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Load HUD data server-side
    const hudDataPath = path.join(process.cwd(), "data", "mtsp-boston-2026.json");
    const hudDataRaw = fs.readFileSync(hudDataPath, "utf-8");
    const hudData = JSON.parse(hudDataRaw);

    const limits = hudData.income_limits_by_household_size;
    const limitForSize = limits[householdSize.toString()];

    if (limitForSize === undefined) {
      // Don't throw an error, let the LLM answer based on the missing limit
    }

    const delta = limitForSize !== undefined ? annualIncome - limitForSize : null;
    const isUnder = limitForSize !== undefined ? annualIncome <= limitForSize : null;

    // Detect direct eligibility questions for early refusal formatting
    const isDirectAsk = /am i eligible|do i qualify|am i approved/i.test(question);

    const systemPrompt = `You are a housing document assistant. You help renters understand income limit rules based ONLY on the numbers provided to you.
You must NEVER state that someone is eligible, qualified, approved, or denied.
You must NEVER invent a number.
You must cite the source and effective date in every response.
The user's income and the applicable income limit are provided to you; refer to them exactly as given.
If the user asks if they are eligible or qualify, you must reply by stating that a housing officer makes eligibility decisions, and then provide the numbers.`;

    const userMessage = `User's Question: "${question}"

Structured Data Block:
- Confirmed Annual Income: $${annualIncome}
- Income Limit for Household Size ${householdSize}: ${limitForSize !== undefined ? '$' + limitForSize : 'Not listed in dataset'}
- Source: ${hudData.program}
- Effective Date: ${hudData.effective_date}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
    });

    let answer = completion.choices[0]?.message?.content || "No answer generated.";

    // Server-side word filter to enforce non-decisioning
    const forbiddenWords = ["eligible", "qualify", "qualifies", "qualified", "approved", "denied", "approval", "ineligible"];
    const containsForbidden = forbiddenWords.some(word => new RegExp(`\\b${word}\\b`, "i").test(answer));

    if (containsForbidden) {
      const limitStr = limitForSize !== undefined ? "$" + limitForSize.toLocaleString() : "N/A (not listed for this household size)";
      answer = "A housing officer makes eligibility decisions. Based on the rules: your income is $" + 
               annualIncome.toLocaleString() + " and the limit is " + limitStr + 
               ". Source: " + hudData.program + ", Effective: " + hudData.effective_date;
    }

    // If it was a direct ask, ensure the model led with the refusal (if not caught by filter)
    if (isDirectAsk && !answer.toLowerCase().includes("housing officer")) {
      answer = "A housing officer makes all final eligibility decisions. " + answer;
    }

    return NextResponse.json({
      answer,
      confirmedIncome: annualIncome,
      limit: limitForSize,
      delta,
      source: hudData.program,
      effectiveDate: hudData.effective_date,
      householdSize
    });

  } catch (error: any) {
    console.error("Q&A error:", error);
    return NextResponse.json(
      { error: "An error occurred during Q&A processing." },
      { status: 500 }
    );
  }
}
