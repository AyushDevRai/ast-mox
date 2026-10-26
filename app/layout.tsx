import type { Metadata } from "next";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/providers";
import { GlobalCursor } from "@/components/layout/global-cursor";
import "./globals.css";
const display = localFont({ src: "../public/fonts/barlow-condensed.woff2", variable: "--font-barlow", display: "swap", weight: "600" });
const body = localFont({ src: "../public/fonts/manrope.woff2", variable: "--font-manrope", display: "swap", weight: "400 800" });
export const metadata: Metadata = {
  title: { default: "AST -Facilitating Excellence", template: "%s | AST" },
  description: "AST - Facilating Excellence",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon_io/favicon.ico" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon_io/favicon.ico",
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        {/* LCS First-Party Tracker */}
        <script
          defer
          src="https://lcs-service.onrender.com/tracker/lcs-tracker.js"
          data-endpoint="https://lcs-service.onrender.com/api/track"
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers locale={locale}>
            <GlobalCursor />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
