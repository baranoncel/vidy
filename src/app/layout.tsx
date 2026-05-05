import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd, softwareApplicationLd, SITE } from "@/lib/seo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7c3aed",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.domain,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", site: SITE.twitter, creator: SITE.twitter },
  icons: {
    icon: [
      { url: "/vidy.svg", type: "image/svg+xml" },
    ],
    apple: "/vidy.svg",
    shortcut: "/vidy.svg",
  },
  manifest: "/manifest.json",
  alternates: { canonical: SITE.domain, types: { "text/plain": [{ url: "/llms.txt", title: "LLMs.txt" }] } },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <JsonLd id="root-org" data={organizationLd()} />
        <JsonLd id="root-software" data={softwareApplicationLd()} />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
