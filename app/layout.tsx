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
  icons: [
    "https://avatars.slack-edge.com/2022-01-11/2950060844657_4cae9e95e482718f4ef6_88.jpg",
  ],
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
