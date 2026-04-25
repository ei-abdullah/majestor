import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Majestor - Your Campus Life, Unified",
  description:
    "A comprehensive academic resource sharing and carpooling platform for universities. Share documents, find rides, and connect with your academic community.",
  keywords: [
    "university",
    "academic",
    "document sharing",
    "carpooling",
    "students",
    "education",
  ],
  icons: {
    icon: "/majestor-logo.png",
    shortcut: "/majestor-logo.png",
    apple: "/majestor-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}