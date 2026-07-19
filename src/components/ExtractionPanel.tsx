"use client";

import { useEffect } from "react";
import { useSession, ExtractedFields, FieldData } from "@/lib/session-context";
import { CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";

export function ExtractionPanel() {
  const { extractedFields, setExtractedFields, setAnnualIncome, annualIncome } = useSession();

  if (!extractedFields) return null;

  const handleFieldChange = (key: keyof ExtractedFields, value: string) => {
    setExtractedFields({
      ...extractedFields,
      [key]: {
        ...extractedFields[key],
        value,
      },
    });
  };

  // Recalculate annual income whenever grossPay or payPeriod changes
  useEffect(() => {
    const payStr = extractedFields.grossPay.value.replace(/[^0-9.]/g, '');
    const pay = parseFloat(payStr);
    const period = extractedFields.payPeriod.value.toLowerCase();

    if (!isNaN(pay) && period) {
      let annual = null;
      if (period.includes("week") && !period.includes("bi")) annual = pay * 52;
      else if (period.includes("biweekly") || period.includes("bi-weekly")) annual = pay * 26;
      else if (period.includes("month")) annual = pay * 12;
      else if (period.includes("year") || period.includes("annual")) annual = pay;
      
      setAnnualIncome(annual);
    } else {
      setAnnualIncome(null);
    }
  }, [extractedFields.grossPay.value, extractedFields.payPeriod.value, setAnnualIncome]);

  const ConfidenceBadge = ({ level }: { level: FieldData["confidence"] }) => {
    if (level === "high") {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-900/20 text-green-400 text-xs font-mono tracking-utility uppercase rounded border border-green-900/50">
          <CheckCircle size={12} />
          <span>High</span>
        </span>
      );
    }
    if (level === "medium") {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-yellow-900/20 text-yellow-400 text-xs font-mono tracking-utility uppercase rounded border border-yellow-900/50">
          <AlertTriangle size={12} />
          <span>Medium</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-900/20 text-red-400 text-xs font-mono tracking-utility uppercase rounded border border-red-900/50">
        <HelpCircle size={12} />
        <span>Low</span>
      </span>
    );
  };

  const FieldRow = ({ 
    label, 
    fieldKey, 
    data 
  }: { 
    label: string; 
    fieldKey: keyof ExtractedFields; 
    data: FieldData 
  }) => (
    <div className="bg-[rgba(26,26,26,0.5)] border border-[rgba(200,196,188,0.1)] rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <label className="font-mono tracking-utility text-sm uppercase text-muted">
          {label}
        </label>
        <ConfidenceBadge level={data.confidence} />
      </div>
      
      <input
        type="text"
        value={data.value}
        onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
        className="w-full bg-background border border-[rgba(200,196,188,0.2)] rounded p-3 font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
      />

      <div className="mt-4">
        <span className="text-xs font-mono tracking-utility text-muted uppercase mb-2 block">Source Evidence</span>
        <blockquote className="border-l-2 border-primary pl-4 py-1 text-sm text-muted bg-[rgba(200,196,188,0.02)] italic">
          {data.source ? `"${data.source}"` : "No evidence found in document."}
        </blockquote>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-light uppercase tracking-tight">Extracted Data</h2>
      <p className="text-muted font-light mb-6">
        Please verify the following fields. You must correct any errors before proceeding.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldRow label="Applicant Name" fieldKey="name" data={extractedFields.name} />
        <FieldRow label="Employer Name" fieldKey="employer" data={extractedFields.employer} />
        <FieldRow label="Gross Pay Amount" fieldKey="grossPay" data={extractedFields.grossPay} />
        <FieldRow label="Pay Period" fieldKey="payPeriod" data={extractedFields.payPeriod} />
      </div>

      <div className="mt-8 p-[1px] rounded-lg bg-gradient-to-r from-transparent via-[rgba(139,58,42,0.3)] to-transparent">
        <div className="bg-[rgba(26,26,26,0.9)] p-6 rounded-lg text-center">
          <p className="text-sm font-mono tracking-utility text-muted uppercase mb-2">
            Estimated Annual Gross Income — calculated from confirmed pay stub
          </p>
          <p className="text-4xl font-light text-primary">
            {annualIncome !== null ? `$${annualIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
