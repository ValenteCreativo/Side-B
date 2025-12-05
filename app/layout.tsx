import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/auth/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { CoinbaseProvider } from "@/components/providers/CoinbaseProvider";
import { PlayerProvider } from "@/components/player/PlayerContext";
import { GlobalPlayer } from "@/components/player/GlobalPlayer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Side B Sessions - Independent Music Marketplace",
  description: "An independent music marketplace for musicians to register and license their music as IP on Story Protocol",
  icons: {
    icon: "/assets/catalog-art.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground`}>
        <CoinbaseProvider>
          <UserProvider>
            <PlayerProvider>
              {children}
              <GlobalPlayer />
              <Toaster />
            </PlayerProvider>
          </UserProvider>
        </CoinbaseProvider>
      </body>
    </html>
  );
}
