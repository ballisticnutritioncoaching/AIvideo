import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/work-sans";
import "./globals.css";

const tomorrow = localFont({
  src: [
    { path: "./fonts/Tomorrow-Light.ttf", weight: "300" },
    { path: "./fonts/Tomorrow-Regular.ttf", weight: "400" },
  ],
  variable: "--font-tomorrow",
  display: "swap",
});

const sharp = localFont({
  src: [{ path: "./fonts/SharpGrotesk-Medium.ttf", weight: "500" }],
  variable: "--font-sharp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Ballistic 12-Week Program",
  description:
    "Strength, conditioning and stupid simple nutrition for parents who are done starting over every Monday.",
  icons: { icon: "/brand/bp-mark-performance-blue.svg" },
};

export const viewport: Viewport = { themeColor: "#001193" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${tomorrow.variable} ${sharp.variable}`}>
      <body>{children}</body>
    </html>
  );
}
