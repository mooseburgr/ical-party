import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";
import type React from "react";

export const metadata: Metadata = {
  title: "iCal Party",
  description: "Welcome to the iCalendar party",
  icons: ["https://fonts.gstatic.com/s/e/notoemoji/17.0/1f5d3_fe0f/72.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Analytics />
          <SpeedInsights />
        </ThemeRegistry>
      </body>
    </html>
  );
}
