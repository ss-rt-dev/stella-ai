import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stella",
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