"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FieldData {
  value: string;
  source: string;
  confidence: "high" | "medium" | "low";
}

export interface ExtractedFields {
  name: FieldData;
  grossPay: FieldData;
  payPeriod: FieldData;
  employer: FieldData;
}

export interface UploadedDoc {
  type: string;
  filename: string;
  uploadedAt: string;
  contentPreview?: string;
}

interface SessionState {
  extractedFields: ExtractedFields | null;
  confirmedFields: ExtractedFields | null;
  annualIncome: number | null;
  householdSize: number | null;
  uploadedDocs: UploadedDoc[];
  setExtractedFields: (fields: ExtractedFields | null) => void;
  setConfirmedFields: (fields: ExtractedFields | null) => void;
  setAnnualIncome: (income: number | null) => void;
  setHouseholdSize: (size: number | null) => void;
  addUploadedDoc: (doc: UploadedDoc) => void;
  clearSession: () => void;
}

const initialState = {
  extractedFields: null,
  confirmedFields: null,
  annualIncome: null,
  householdSize: null,
  uploadedDocs: [],
};

const SessionContext = createContext<SessionState | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [extractedFields, setExtractedFields] = useState<ExtractedFields | null>(null);
  const [confirmedFields, setConfirmedFields] = useState<ExtractedFields | null>(null);
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);
  const [householdSize, setHouseholdSize] = useState<number | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);

  const addUploadedDoc = (doc: UploadedDoc) => {
    setUploadedDocs((prev) => [...prev, doc]);
  };

  const clearSession = () => {
    setExtractedFields(null);
    setConfirmedFields(null);
    setAnnualIncome(null);
    setHouseholdSize(null);
    setUploadedDocs([]);
  };

  return (
    <SessionContext.Provider
      value={{
        extractedFields,
        confirmedFields,
        annualIncome,
        householdSize,
        uploadedDocs,
        setExtractedFields,
        setConfirmedFields,
        setAnnualIncome,
        setHouseholdSize,
        addUploadedDoc,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
