"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session-context";
import { ChecklistPanel } from "@/components/ChecklistPanel";
import { ExportPanel } from "@/components/ExportPanel";

export default function PrepareScreen() {
  const { confirmedFields } = useSession();
  const router = useRouter();

  if (!confirmedFields) {
    return (
      <div className="text-center space-y-6">
        <p className="text-muted font-mono uppercase tracking-utility">No confirmed session found.</p>
        <button onClick={() => router.push("/")} className="text-primary hover:text-white transition-colors">
          Return to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-reveal-up">
      <div className="space-y-4">
        <h1 className="text-4xl font-light uppercase tracking-tight">Prepare Packet</h1>
        <p className="text-muted text-lg max-w-2xl font-light">
          Review the required documents for your LIHTC application. Upload synthetic documents 
          to clear checklist items.
        </p>
      </div>

      <div className="space-y-8">
        <ChecklistPanel />
        <ExportPanel />
      </div>

      <div className="border-t border-[rgba(200,196,188,0.1)] pt-8 flex justify-start">
        <button 
          onClick={() => router.push("/understand")}
          className="px-8 py-4 border border-[rgba(200,196,188,0.2)] text-foreground font-mono tracking-utility text-sm rounded-lg hover:border-primary hover:text-primary transition-colors duration-500"
        >
          BACK TO RULES
        </button>
      </div>
    </div>
  );
}
