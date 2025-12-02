import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/auth/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { CoinbaseProvider } from "@/components/providers/CoinbaseProvider";

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
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <CoinbaseProvider>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </CoinbaseProvider>
      </body>
    </html>
  );
}
