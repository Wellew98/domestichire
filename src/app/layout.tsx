import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getUser } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://domestichire-psi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | DomesticHire",
    default: "DomesticHire — Find Trusted Domestic Workers in Bulawayo",
  },
  description:
    "Browse verified profiles of maids, nannies, drivers, gardeners, cleaners, cooks, chefs, and nurse aides in Bulawayo. Pay a one-time $20 placement fee and get direct contact access.",
  keywords: [
    "domestic workers Bulawayo",
    "hire maid Bulawayo",
    "nanny Bulawayo",
    "domestic helper Bulawayo",
    "gardeners Bulawayo",
    "drivers Bulawayo",
    "cooks Bulawayo",
    "nurse aides Bulawayo",
    "house help Bulawayo",
    "maid recruitment Bulawayo",
    "domestic worker placement",
  ],
  authors: [{ name: "DomesticHire" }],
  creator: "DomesticHire",
  publisher: "DomesticHire",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_ZW",
    url: BASE_URL,
    siteName: "DomesticHire",
    title: "DomesticHire — Find Trusted Domestic Workers in Zimbabwe",
    description:
      "Browse verified domestic worker profiles. Pay once, get direct contact. Maids, nannies, drivers, gardeners, cooks & more in Zimbabwe.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "DomesticHire — Find Trusted Domestic Workers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DomesticHire — Find Trusted Domestic Workers in Zimbabwe",
    description:
      "Browse verified domestic worker profiles. Pay once, get direct contact. Maids, nannies, drivers, gardeners, cooks & more.",
    images: [`${BASE_URL}/og-image.png`],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html
      lang="en-ZW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar user={user ? { id: user.id, email: user.email, role: user.role } : null} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
