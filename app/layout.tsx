import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stella AI — Powered by Grok",
  description: "Stella is your intelligent AI companion, built with Grok by xAI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}