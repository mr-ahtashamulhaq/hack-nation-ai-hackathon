"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session-context";
import { ExtractionPanel } from "@/components/ExtractionPanel";

export default function ProfileScreen() {
  const { 
    extractedFields, 
    setExtractedFields, 
    confirmedFields, 
    setConfirmedFields, 
    householdSize, 
    setHouseholdSize,
    setAnnualIncome,
    addUploadedDoc
  } = useSession();
  const router = useRouter();

  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteText, setPasteText] = useState("");
  const [isPasting, setIsPasting] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await processFile(file);
    e.target.value = ''; // Reset input
  };

  const processFile = async (file: File) => {
    setErrorMsg("");
    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setExtractedFields(data.fields);
      addUploadedDoc({
        type: "pay_stub",
        filename: file.name,
        uploadedAt: new Date().toISOString()
      });
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to extract data. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePasteSubmit = async () => {
    if (!pasteText.trim()) return;
    setErrorMsg("");
    setIsExtracting(true);
    
    try {
      const formData = new FormData();
      formData.append("text", pasteText);
      
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setExtractedFields(data.fields);
      addUploadedDoc({
        type: "pay_stub",
        filename: "Pasted Text",
        uploadedAt: new Date().toISOString()
      });
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to extract data. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const isFormValid = () => {
    return (
      extractedFields &&
      extractedFields.name.value.trim() !== "" &&
      extractedFields.grossPay.value.trim() !== "" &&
      extractedFields.payPeriod.value.trim() !== "" &&
      extractedFields.employer.value.trim() !== "" &&
      householdSize !== null &&
      householdSize >= 1 && householdSize <= 8
    );
  };

  const handleConfirm = () => {
    if (isFormValid()) {
      setConfirmedFields(extractedFields);
      // Annual income is already set by the ExtractionPanel on changes
      router.push("/understand");
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-light uppercase tracking-tight">Profile Data</h1>
        <p className="text-muted text-lg max-w-2xl font-light">
          Upload a synthetic pay stub to extract income information. This app uses 
          deterministic rules. You must confirm all extracted data.
        </p>
      </div>

      {!extractedFields && (
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[rgba(200,196,188,0.2)] via-[rgba(26,26,26,0.8)] to-[rgba(139,58,42,0.3)]">
          <div className="bg-[rgba(26,26,26,0.8)] backdrop-blur-3xl rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,58,42,0.1)_0%,transparent_80%)] blur-[80px]" />
            
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] space-y-6">
              
              {!isPasting ? (
                <>
                  <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl">Upload Pay Stub</h3>
                    <p className="text-muted text-sm font-mono tracking-utility">Accepts .TXT or .PDF</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <label className="relative cursor-pointer bg-primary text-background px-6 py-3 font-mono tracking-utility text-sm rounded-lg hover:bg-white transition-colors duration-500">
                      <span>Select File</span>
                      <input 
                        type="file" 
                        accept=".txt,.pdf"
                        className="sr-only" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        disabled={isExtracting}
                      />
                    </label>
                    <button 
                      onClick={() => setIsPasting(true)}
                      className="px-6 py-3 border border-[rgba(200,196,188,0.2)] text-foreground font-mono tracking-utility text-sm rounded-lg hover:border-primary hover:text-primary transition-colors duration-500"
                    >
                      Paste Text
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full max-w-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-mono tracking-utility text-primary">Paste Document Text</h3>
                    <button onClick={() => setIsPasting(false)} className="text-muted hover:text-foreground text-sm font-mono">Cancel</button>
                  </div>
                  <textarea 
                    className="w-full h-48 bg-background border border-[rgba(200,196,188,0.2)] rounded-lg p-4 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    placeholder="Paste pay stub text here..."
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                  />
                  <button 
                    onClick={handlePasteSubmit}
                    disabled={isExtracting || !pasteText.trim()}
                    className="w-full bg-primary text-background px-6 py-3 font-mono tracking-utility text-sm rounded-lg hover:bg-white transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Process Text
                  </button>
                </div>
              )}

              {isExtracting && (
                <div className="flex items-center space-x-3 text-primary font-mono tracking-utility mt-4">
                  <div className="w-2 h-2 bg-primary rounded-full animate-flicker"></div>
                  <span>SYS.EXTRACTING</span>
                </div>
              )}

              {errorMsg && (
                <div className="text-red-400 font-mono text-sm mt-4 text-center">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {extractedFields && (
        <div className="space-y-12 animate-reveal-up">
          <ExtractionPanel />
          
          <div className="max-w-2xl">
            <label className="block text-sm font-mono text-muted mb-2 tracking-utility">
              HOUSEHOLD SIZE (NUMBER OF PEOPLE)
            </label>
            <input 
              type="number"
              min="1"
              max="8"
              value={householdSize || ""}
              onChange={(e) => setHouseholdSize(parseInt(e.target.value) || null)}
              className="w-full bg-background border border-[rgba(200,196,188,0.2)] rounded p-4 font-mono text-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="border-t border-[rgba(200,196,188,0.1)] pt-8 flex justify-end">
            <button 
              onClick={handleConfirm}
              disabled={!isFormValid()}
              className="bg-primary text-background px-8 py-4 font-mono tracking-utility text-sm rounded-lg hover:bg-white transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONFIRM AND PROCEED
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
