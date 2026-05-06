import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import AIChatbot from "@/components/AIChatbot";
import OmniDimensionWidget from "@/components/OmniDimensionWidget";
import "./globals.css";

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: 'swap',
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Himanshu Upadhyay",
  description: "Data Analyst & AI Application Developer Portfolio",
};

const voiceWidgetEnabled = Boolean(
  process.env.NEXT_PUBLIC_OMNIDIM_WIDGET_EMBED_SCRIPT ||
    process.env.NEXT_PUBLIC_OMNIDIM_WIDGET_SCRIPT_URL
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="antialiased">
        <Header />
        {children}
        <AIChatbot voiceWidgetEnabled={voiceWidgetEnabled} />
        {voiceWidgetEnabled && <OmniDimensionWidget />}
      </body>
    </html>
  );
}
