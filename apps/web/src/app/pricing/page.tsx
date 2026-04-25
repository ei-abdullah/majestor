import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Majestor",
  description: "Majestor Elite pricing — currently unavailable.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FBCB43] to-[#FDD76A] mb-8">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#121826] mb-4 tracking-tight">
            Currently{" "}
            <span className="bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] bg-clip-text text-transparent">
              Unavailable
            </span>
          </h1>

          <p className="text-[#5A6275] text-lg leading-relaxed mb-10 max-w-md mx-auto">
            Majestor Elite is not yet available for purchase. We&apos;re
            finalizing the legal and payment setup. Please check back soon.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#121826] text-white font-medium px-8 py-3.5 rounded-full hover:bg-[#2a3441] transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
