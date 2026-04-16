import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Languages, LayoutDashboard, PlusCircle, BrainCircuit } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { LanguageProvider } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/LanguageToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeutschFlash | Premium German A2 Learning",
  description: "Master German vocabulary with spaced repetition and AI-powered cards.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DeutschFlash",
  },
};

export const viewport: Viewport = {
  themeColor: "#05010d",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <LanguageProvider>
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight shrink-0">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-lg rotate-3">
                  <Languages size={20} />
                </div>
                <span className="hidden sm:inline tracking-tighter uppercase font-black">Deutsch<span className="text-primary">Flash</span></span>
              </Link>

              <div className="flex items-center gap-4">
                <LanguageToggle />
                {user ? (
                  <nav className="flex items-center gap-2">
                    <LogoutButton />
                  </nav>
                ) : (
                  <Link 
                    href="/login" 
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t py-8 bg-muted/30">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>© 2026 DeutschFlash. Learn better, faster.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:underline">Privacy</Link>
                <Link href="/terms" className="hover:underline">Terms</Link>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
