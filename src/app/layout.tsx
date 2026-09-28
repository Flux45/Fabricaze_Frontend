import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Fabricaze | Gateway to Digital Manufacturing in India",
  description:
    "Empowering India's 63M MSMEs with an AI-driven digital marketplace for on-demand CNC machining, sheet metal fabrication, laser cutting, and 3D printing.",
  keywords: [
    "Manufacturing Marketplace India",
    "CNC Machining Indore",
    "Sheet Metal Pune",
    "Fabricaze",
    "MSME Manufacturing",
    "Digital Manufacturing India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
