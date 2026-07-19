"use client";

import { useRef, useState } from "react";
import { useSession, UploadedDoc } from "@/lib/session-context";
import { requiredDocs, RequiredDoc } from "@/lib/required-docs";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export function ChecklistPanel() {
  const { uploadedDocs, addUploadedDoc } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDocType, setActiveDocType] = useState<string | null>(null);

  const handleUploadClick = (docId: string) => {
    setActiveDocType(docId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeDocType) return;

    // For the demo: if the filename contains "expired", backdate it to 95 days ago
    let uploadDate = new Date();
    if (file.name.toLowerCase().includes("expired")) {
      uploadDate.setDate(uploadDate.getDate() - 95);
    }

    addUploadedDoc({
      type: activeDocType,
      filename: file.name,
      uploadedAt: uploadDate.toISOString(),
      contentPreview: file.type.includes("text") ? "Text file attached." : "Binary file attached."
    });

    e.target.value = "";
    setActiveDocType(null);
  };

  const getDocStatus = (doc: RequiredDoc) => {
    // Get the most recent upload for this doc type
    const uploadsForType = uploadedDocs.filter(d => d.type === doc.id);
    if (uploadsForType.length === 0) {
      return { status: "MISSING", icon: <XCircle size={14} />, colorClass: "text-red-400 bg-red-900/20 border-red-900/50" };
    }

    const latestUpload = uploadsForType[uploadsForType.length - 1];
    const uploadedDate = new Date(latestUpload.uploadedAt);
    const now = new Date();
    const daysSinceUpload = (now.getTime() - uploadedDate.getTime()) / (1000 * 3600 * 24);

    if (doc.expiryDays !== null && daysSinceUpload > doc.expiryDays) {
      return { status: "EXPIRED", icon: <Clock size={14} />, colorClass: "text-yellow-400 bg-yellow-900/20 border-yellow-900/50", latestUpload };
    }

    return { status: "UPLOADED", icon: <CheckCircle size={14} />, colorClass: "text-green-400 bg-green-900/20 border-green-900/50", latestUpload };
  };

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      
      {requiredDocs.map(doc => {
        const { status, icon, colorClass, latestUpload } = getDocStatus(doc);
        
        return (
          <div key={doc.id} className="bg-[rgba(26,26,26,0.5)] border border-[rgba(200,196,188,0.1)] rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[rgba(200,196,188,0.02)] transition-colors duration-500">
            <div>
              <h4 className="text-foreground text-lg mb-2">{doc.label}</h4>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-mono tracking-utility uppercase rounded border ${colorClass}`}>
                  {icon}
                  <span>{status}</span>
                </span>
                {latestUpload && (
                  <span className="text-xs font-mono text-muted truncate max-w-[200px] md:max-w-xs">
                    {latestUpload.filename}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleUploadClick(doc.id)}
                className="px-6 py-3 border border-[rgba(200,196,188,0.2)] text-foreground font-mono tracking-utility text-sm rounded-lg hover:border-primary hover:text-primary transition-colors duration-500 whitespace-nowrap"
              >
                {status === "UPLOADED" ? "REPLACE" : "UPLOAD"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
