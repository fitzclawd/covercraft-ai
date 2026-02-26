import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoverCraft AI — AI Cover Letter Generator",
  description: "Generate tailored, professional cover letters in seconds with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
