import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/lib/session-context";
import { Nav } from "@/components/Nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "400", "600"],
});

export const metadata: Metadata = {
  title: "RentReady — Know your numbers. Walk in prepared.",
  description: "AI-powered housing application assistant. Upload a paystub, understand your income limits, and get your document checklist ready.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="flex flex-col">
        <SessionProvider>
          <Nav />
          <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 md:px-16 py-12 animate-reveal-up">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
