export interface RequiredDoc {
  id: string;
  label: string;
  expiryDays: number | null;
}

export const requiredDocs: RequiredDoc[] = [
  { id: "pay_stub", label: "Recent Pay Stub (last 30 days)", expiryDays: 30 },
  { id: "photo_id", label: "Government-issued Photo ID", expiryDays: null },
  { id: "bank_statement", label: "Bank Statement (last 60 days)", expiryDays: 60 },
  { id: "benefit_letter", label: "Benefit Award Letter (last 90 days)", expiryDays: 90 },
  { id: "tax_return", label: "Most Recent Tax Return (W-2 or 1040)", expiryDays: null },
];
