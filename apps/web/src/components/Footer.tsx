import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAFBFC] border-t border-[#F0F2F5]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/majestor-logo.png"
                alt="Majestor"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold text-[#121826]">Majestor</span>
            </Link>
            <p className="text-sm text-[#5A6275] leading-relaxed">
              Your campus life, unified. Share resources, find rides, and connect.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <p className="text-xs font-semibold text-[#121826] uppercase tracking-wider mb-4">Product</p>
              <ul className="space-y-3">
                <li>
                  <Link href="/#features" className="text-sm text-[#5A6275] hover:text-[#121826] transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="text-sm text-[#5A6275] hover:text-[#121826] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#5A6275] hover:text-[#121826] transition-colors"
                  >
                    Download
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#121826] uppercase tracking-wider mb-4">Legal</p>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-sm text-[#5A6275] hover:text-[#121826] transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-[#5A6275] hover:text-[#121826] transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F0F2F5] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#9E9E9E]">
            © {currentYear} Majestor. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9E9E9E] hover:text-[#121826] transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
              </svg>
            </a>
            <a
              href="mailto:abdullah.zafar.career@gmail.com"
              className="text-[#9E9E9E] hover:text-[#121826] transition-colors"
              aria-label="Email"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

