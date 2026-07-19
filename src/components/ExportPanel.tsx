"use client";

import { useSession } from "@/lib/session-context";
import { requiredDocs } from "@/lib/required-docs";

export function ExportPanel() {
  const { confirmedFields, annualIncome, householdSize, uploadedDocs } = useSession();

  const handleExport = () => {
    let content = `======================================\n`;
    content += `         PACKETREADY SUMMARY          \n`;
    content += `======================================\n\n`;
    
    content += `APPLICANT PROFILE\n`;
    content += `--------------------------------------\n`;
    content += `Name:           ${confirmedFields?.name?.value || 'N/A'}\n`;
    content += `Household Size: ${householdSize || 'N/A'}\n`;
    content += `Annual Income:  $${annualIncome?.toLocaleString() || 'N/A'}\n`;
    content += `Employer:       ${confirmedFields?.employer?.value || 'N/A'}\n\n`;

    content += `DOCUMENT CHECKLIST\n`;
    content += `--------------------------------------\n`;
    
    requiredDocs.forEach(doc => {
      const uploadsForType = uploadedDocs.filter(d => d.type === doc.id);
      
      if (uploadsForType.length === 0) {
        content += `[ ] ${doc.label} -> MISSING\n`;
      } else {
        const latestUpload = uploadsForType[uploadsForType.length - 1];
        const uploadedDate = new Date(latestUpload.uploadedAt);
        const now = new Date();
        const daysSinceUpload = (now.getTime() - uploadedDate.getTime()) / (1000 * 3600 * 24);
        
        if (doc.expiryDays !== null && daysSinceUpload > doc.expiryDays) {
          content += `[x] ${doc.label} -> EXPIRED (${latestUpload.filename})\n`;
        } else {
          content += `[x] ${doc.label} -> UPLOADED (${latestUpload.filename})\n`;
        }
      }
    });

    content += `\n======================================\n`;
    content += `This packet was prepared using PacketReady.\n`;
    content += `A housing officer will make the final\n`;
    content += `eligibility determination.\n`;
    content += `======================================\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `PacketReady_${confirmedFields?.name?.value?.replace(/\s+/g, '_') || 'Applicant'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-center p-[1px] rounded-lg bg-gradient-to-r from-transparent via-[rgba(139,58,42,0.3)] to-transparent animate-reveal-up">
      <div className="bg-[rgba(26,26,26,0.9)] p-6 rounded-lg w-full flex flex-col md:flex-row justify-between items-center">
        <div>
          <h3 className="text-xl text-primary font-mono tracking-utility uppercase mb-2">Ready to Export</h3>
          <p className="text-muted text-sm font-light">Download a summary of your profile and document status to your device.</p>
        </div>
        <button 
          onClick={handleExport}
          className="mt-4 md:mt-0 bg-primary text-background px-8 py-4 font-mono tracking-utility text-sm rounded-lg hover:bg-white transition-colors duration-500 whitespace-nowrap"
        >
          DOWNLOAD PACKET
        </button>
      </div>
    </div>
  );
}
