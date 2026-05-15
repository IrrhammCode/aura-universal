import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PHProvider } from "@/components/providers/PostHogProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura | Your Universal Multimodal AI Agent",
  description: "Aura is an emotionally intelligent, vision-aware AI agent for modern businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PHProvider>
          {children}
        </PHProvider>
      </body>
    </html>
  );
}
