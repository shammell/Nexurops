import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend", display: "swap" });

export const metadata: Metadata = {
  title: "Nexurops - AI Agents & DevOps Automation",
  description:
    "Nexurops builds AI agents and DevOps automation that run your infrastructure: CI/CD, cloud, monitoring, and security.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
