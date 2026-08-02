import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stella AI",
  description: "Stella — powered by Grok",
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