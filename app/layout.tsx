import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { EditProvider } from "@/components/editable/EditProvider";
import { EditorUI } from "@/components/editable/EditorUI";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/config/site.config";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.brandName} — Custom Pet Embroidered Apparel`,
    template: `%s · ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  keywords: [
    "custom pet embroidery",
    "custom pet t-shirt",
    "custom pet tshirt",
    "custom pet hoodie",
    "custom pet socks",
    "pet portrait embroidery",
    "personalized pet clothing",
    "embroidered pet apparel",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: "/brand/pawthread-mark.png",
    apple: "/brand/pawthread-mark.png",
  },
  openGraph: {
    title: `${siteConfig.brandName} — Turn your pet into something you can wear`,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.siteUrl,
    siteName: siteConfig.brandName,
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: siteConfig.brandName },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandName} — Turn your pet into something you can wear`,
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

const socials: string[] = [
  siteConfig.social.instagram,
  siteConfig.social.tiktok,
  siteConfig.social.pinterest,
];
const sameAs = socials.filter((u) => u !== "#");

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.brandName,
  url: siteConfig.siteUrl,
  description: siteConfig.description,
  sameAs,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <JsonLd data={orgJsonLd} />
        <EditProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="min-h-[60vh]">{children}</main>
            <Footer />
          </CartProvider>
          <EditorUI />
        </EditProvider>
      </body>
    </html>
  );
}
