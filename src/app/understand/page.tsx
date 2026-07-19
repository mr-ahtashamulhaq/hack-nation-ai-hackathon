"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session-context";
import hudData from "../../../data/mtsp-boston-2026.json";

export default function UnderstandScreen() {
  const { confirmedFields, annualIncome, householdSize } = useSession();
  const router = useRouter();
  
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [qaResult, setQaResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!confirmedFields || annualIncome === null || householdSize === null) {
    // If accessed directly without completing screen 1, redirect or show message
    return (
      <div className="text-center space-y-6">
        <p className="text-muted font-mono uppercase tracking-utility">No confirmed session found.</p>
        <button onClick={() => router.push("/")} className="text-primary hover:text-white transition-colors">
          Return to Profile
        </button>
      </div>
    );
  }

  const limits = (hudData as any).income_limits_by_household_size;
  const limitForSize = limits[householdSize.toString()];
  const hasLimit = limitForSize !== undefined;
  
  const delta = hasLimit ? annualIncome - limitForSize : null;
  const isUnder = hasLimit ? annualIncome <= limitForSize : null;

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    setErrorMsg("");
    setQaResult(null);

    try {
      const res = await fetch("/api/rules-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          annualIncome,
          householdSize
        })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setQaResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to get an answer.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-12 animate-reveal-up">
      <div className="space-y-4">
        <h1 className="text-4xl font-light uppercase tracking-tight">Rules & Limits</h1>
        <p className="text-muted text-lg max-w-2xl font-light">
          Ask questions about the income limits. The system will combine your confirmed 
          income with the official HUD rules. It will not make eligibility decisions.
        </p>
      </div>

      <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[rgba(200,196,188,0.2)] via-[rgba(26,26,26,0.8)] to-[rgba(139,58,42,0.3)]">
        <div className="bg-[rgba(26,26,26,0.8)] backdrop-blur-3xl rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,58,42,0.1)_0%,transparent_80%)] blur-[80px]" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-mono tracking-utility text-sm uppercase text-muted">Confirmed Profile</h3>
              
              <div>
                <p className="text-xs text-muted font-mono uppercase mb-1">Annual Gross Income</p>
                <p className="text-3xl text-foreground font-light">${annualIncome.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted font-mono uppercase mb-1">Household Size</p>
                <p className="text-3xl text-foreground font-light">{householdSize} Person{householdSize > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="space-y-6 md:border-l md:border-[rgba(200,196,188,0.1)] md:pl-8">
              <h3 className="font-mono tracking-utility text-sm uppercase text-muted">HUD MTSP Limit</h3>
              
              {hasLimit ? (
                <>
                  <div>
                    <p className="text-xs text-muted font-mono uppercase mb-1">{householdSize} Person Limit</p>
                    <p className="text-3xl text-foreground font-light">${limitForSize.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted font-mono uppercase mb-1">Difference</p>
                    <p className={`text-3xl font-light ${isUnder ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.abs(delta!).toLocaleString()} {isUnder ? 'Below' : 'Above'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-yellow-400 font-mono text-sm">
                  Limit data not available for household size {householdSize}.
                </div>
              )}
            </div>
          </div>
          
          <div className="relative z-10 mt-8 pt-4 border-t border-[rgba(200,196,188,0.1)]">
            <p className="text-xs font-mono tracking-utility text-muted uppercase">
              Source: {hudData.program} — {hudData.rule_year} — Effective {hudData.effective_date}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-light uppercase tracking-tight">Ask a Question</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="e.g. 'Am I under the limit?'"
            className="flex-grow bg-background border border-[rgba(200,196,188,0.2)] rounded p-4 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            disabled={isAsking}
          />
          <button 
            onClick={handleAsk}
            disabled={isAsking || !question.trim()}
            className="bg-primary text-background px-8 py-4 font-mono tracking-utility text-sm rounded-lg hover:bg-white transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isAsking ? 'THINKING...' : 'ASK'}
          </button>
        </div>

        {errorMsg && (
          <div className="text-red-400 font-mono text-sm">
            {errorMsg}
          </div>
        )}

        {qaResult && (
          <div className="mt-8 bg-[rgba(26,26,26,0.5)] border border-[rgba(200,196,188,0.1)] rounded-lg p-6 space-y-6 animate-reveal-up">
            <div className="space-y-4">
              <h3 className="font-mono tracking-utility text-sm uppercase text-primary">Response</h3>
              <p className="text-foreground leading-relaxed font-light">
                {qaResult.answer}
              </p>
            </div>

            <div className="border-l-2 border-primary pl-4 py-2 space-y-2 bg-[rgba(200,196,188,0.02)] font-mono text-sm text-muted">
              <h4 className="tracking-utility uppercase text-xs text-foreground mb-4">Deterministic Calculation</h4>
              <div className="grid grid-cols-2 max-w-md gap-2">
                <span>Your annual income:</span>
                <span className="text-right">${qaResult.confirmedIncome?.toLocaleString() ?? 'N/A'}</span>
                
                <span>Limit ({qaResult.householdSize} persons):</span>
                <span className="text-right">
                  {qaResult.limit != null ? `$${qaResult.limit.toLocaleString()}` : 'Not listed for this household size'}
                </span>
                
                {qaResult.delta != null && (
                  <>
                    <span className="pt-2 border-t border-[rgba(200,196,188,0.1)]">Difference:</span>
                    <span className="pt-2 border-t border-[rgba(200,196,188,0.1)] text-right">
                      ${Math.abs(qaResult.delta).toLocaleString()} {qaResult.delta <= 0 ? 'below limit' : 'above limit'}
                    </span>
                  </>
                )}
              </div>
              <div className="pt-4 text-xs opacity-50">
                Source: {qaResult.source} | Effective: {qaResult.effectiveDate}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[rgba(200,196,188,0.1)] pt-8 flex justify-between">
        <button 
          onClick={() => router.push("/")}
          className="px-8 py-4 border border-[rgba(200,196,188,0.2)] text-foreground font-mono tracking-utility text-sm rounded-lg hover:border-primary hover:text-primary transition-colors duration-500"
        >
          BACK TO PROFILE
        </button>
        <button 
          onClick={() => router.push("/prepare")}
          className="bg-primary text-background px-8 py-4 font-mono tracking-utility text-sm rounded-lg hover:bg-white transition-colors duration-500"
        >
          PREPARE PACKET
        </button>
      </div>
    </div>
  );
}
