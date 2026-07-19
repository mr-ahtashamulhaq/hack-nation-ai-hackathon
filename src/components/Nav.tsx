"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/session-context";

export function Nav() {
  const pathname = usePathname();
  const { clearSession } = useSession();

  const steps = [
    { name: "Profile", path: "/" },
    { name: "Understand", path: "/understand" },
    { name: "Prepare", path: "/prepare" },
  ];

  const handleDeleteSession = () => {
    if (window.confirm("This will permanently remove all data from this session. Continue?")) {
      clearSession();
      // Optionally redirect to home if not already there, though clearSession resetting state might be enough
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgba(26,26,26,0.8)] backdrop-blur-md border-b border-[rgba(200,196,188,0.1)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.svg" alt="PacketReady logo" className="w-8 h-8 rounded-md" />
            <span className="font-mono text-primary font-bold tracking-[0.3em] uppercase">
              PacketReady
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4 font-mono text-sm tracking-[0.3em] uppercase">
          {steps.map((step, index) => {
            const isActive = pathname === step.path || (step.path !== "/" && pathname.startsWith(step.path));
            return (
              <div key={step.name} className="flex items-center">
                <Link 
                  href={step.path}
                  className={`transition-colors duration-500 ${isActive ? 'text-primary' : 'text-muted hover:text-foreground'}`}
                >
                  {step.name}
                </Link>
                {index < steps.length - 1 && (
                  <span className="mx-4 text-muted opacity-50">›</span>
                )}
              </div>
            );
          })}
        </nav>

        <div>
          <button 
            onClick={handleDeleteSession}
            className="font-mono text-sm tracking-[0.3em] uppercase px-4 py-2 border border-[rgba(200,196,188,0.2)] text-muted hover:text-primary hover:border-primary transition-colors duration-500 rounded"
          >
            Delete Session
          </button>
        </div>
      </div>
    </header>
  );
}
