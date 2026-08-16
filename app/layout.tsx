import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  metadataBase: new URL("https://hijri.shahrulestar.com"),
  title: "Hijri Calendar MCP",
  description:
    "MCP Server for Malaysia's Islamic calendar. Never miss an important date—look up Hijri calendar timings and get accurate info on Ramadan, Aidilfitri, Aidiladha, Maal Hijrah, and Maulidur Rasul to keep your app in tune with what matters to your users.",
  openGraph: {
    title: "Hijri Calendar MCP",
    description:
      "MCP Server for Malaysia's Islamic calendar. Never miss an important date—look up Hijri calendar timings and get accurate info on Ramadan, Aidilfitri, Aidiladha, Maal Hijrah, and Maulidur Rasul to keep your app in tune with what matters to your users.",
    url: "/",
    siteName: "Hijri Calendar MCP",
    type: "website",
    images: [
      {
        url: "/cover.png",
        alt: "Hijri Calendar MCP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hijri Calendar MCP",
    description:
      "MCP Server for Malaysia's Islamic calendar. Never miss an important date—look up Hijri calendar timings and get accurate info on Ramadan, Aidilfitri, Aidiladha, Maal Hijrah, and Maulidur Rasul to keep your app in tune with what matters to your users.",
    images: ["/cover.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans antialiased">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
