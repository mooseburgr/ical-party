import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";

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
          {children}
          <Analytics />
        </ThemeRegistry>
      </body>
    </html>
  );
}
