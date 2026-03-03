import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NOD FLOW — Contemporary Art Gallery",
    template: "%s | NOD FLOW",
  },
  description:
    "NOD FLOW is a contemporary art gallery presenting groundbreaking exhibitions and supporting emerging and established artists.",
  keywords: ["contemporary art", "gallery", "exhibitions", "artists", "Bucharest", "NOD FLOW"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.nodflo.com",
    siteName: "NOD FLOW",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
