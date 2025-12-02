import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/auth/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { CDPReactProvider } from "@coinbase/cdp-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Side B Sessions - Independent Music Marketplace",
  description: "A minimalist marketplace for independent musicians to register and license their music as IP on Story Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projectId = process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID || '';

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <CDPReactProvider
          config={{
            projectId: projectId,
            ethereum: { createOnLogin: "eoa" },
            appName: "Side B Sessions"
          }}
        >
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </CDPReactProvider>
      </body>
    </html>
  );
}
