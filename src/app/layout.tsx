import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Aaharika – Flavours Made for Memories | Catering & Event Management in Kolkata",
  description:
    "Aaharika offers premium Kolkata catering & complete event management — authentic Bengali, Indo-Chinese and Mughlai cuisine for weddings, birthdays and corporate events.",
  keywords: [
    "Kolkata catering",
    "Bengali food catering",
    "Indo-Chinese catering",
    "Mughlai catering",
    "wedding catering Kolkata",
    "event management Kolkata",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Aaharika – Flavours Made for Memories",
    description:
      "Premium catering & event management in Kolkata. Bengali, Indo-Chinese & Mughlai cuisine for every celebration.",
    type: "website",
    locale: "en_IN",
    siteName: "Aaharika",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
