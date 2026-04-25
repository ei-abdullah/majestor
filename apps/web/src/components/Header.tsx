"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-[#F0F2F5]">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/majestor-logo.png"
              alt="Majestor"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="font-semibold text-lg text-[#121826]">Majestor</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[#5A6275] hover:text-[#121826] transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-[#5A6275] hover:text-[#121826] transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-[#5A6275] hover:text-[#121826] transition-colors text-sm font-medium"
            >
              About
            </Link>
            <a
              href="https://play.google.com/store/apps/details?id=com.majestor.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium bg-[#121826] text-white px-5 py-2.5 rounded-full hover:bg-[#2a3441] transition-colors"
            >
              Get App
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 text-[#121826]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 pt-4 border-t border-[#F0F2F5]">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-[#5A6275] hover:text-[#121826] transition-colors text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#features"
                className="text-[#5A6275] hover:text-[#121826] transition-colors text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#about"
                className="text-[#5A6275] hover:text-[#121826] transition-colors text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <a
                href="https://play.google.com/store/apps/details?id=com.majestor.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium bg-[#121826] text-white px-5 py-2.5 rounded-full text-center mt-2"
              >
                Get App
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

