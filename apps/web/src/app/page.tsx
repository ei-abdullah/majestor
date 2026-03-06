import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Clean & Minimal */}
        <section className="relative min-h-[90vh] flex items-center">
          {/* Subtle gradient orbs */}
          <div className="absolute top-20 right-[20%] w-[500px] h-[500px] bg-[#3A6FF8]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] bg-[#6FD0C5]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
            <div className="inline-flex items-center gap-2 border border-[#E6ECFF] bg-white/80 backdrop-blur-sm text-[#3A6FF8] px-5 py-2.5 rounded-full text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 bg-[#3A6FF8] rounded-full" />
              For CUST Students
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#121826] leading-[1.1] mb-6 tracking-tight">
              Your Campus Life,
              <br />
              <span className="bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] bg-clip-text text-transparent">
                Unified.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#5A6275] mb-12 max-w-xl mx-auto leading-relaxed">
              Share resources. Find rides. Connect with your community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#121826] text-white font-medium px-8 py-4 rounded-full hover:bg-[#2a3441] transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                Get the App
              </a>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 text-[#5A6275] font-medium px-8 py-4 rounded-full border border-[#E6ECF5] hover:border-[#3A6FF8] hover:text-[#3A6FF8] transition-all duration-200"
              >
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section - Minimal Grid */}
        <section id="features" className="py-32 bg-[#FAFBFC]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <p className="text-[#3A6FF8] font-medium text-sm uppercase tracking-wider mb-4">Features</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#121826] tracking-tight">
                Everything you need
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-2xl bg-white border border-[#F0F2F5] hover:border-[#3A6FF8]/20 hover:shadow-lg hover:shadow-[#3A6FF8]/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3A6FF8] to-[#5B8DFA] flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#121826] mb-2">Documents</h3>
                <p className="text-[#5A6275] text-sm leading-relaxed">
                  Share past papers, notes, and assignments with your peers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-2xl bg-white border border-[#F0F2F5] hover:border-[#6FD0C5]/20 hover:shadow-lg hover:shadow-[#6FD0C5]/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6FD0C5] to-[#8DDDD3] flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#121826] mb-2">Carpooling</h3>
                <p className="text-[#5A6275] text-sm leading-relaxed">
                  Find rides to campus or share yours with fellow students.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-2xl bg-white border border-[#F0F2F5] hover:border-[#FBCB43]/20 hover:shadow-lg hover:shadow-[#FBCB43]/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FBCB43] to-[#FDD76A] flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#121826] mb-2">Community</h3>
                <p className="text-[#5A6275] text-sm leading-relaxed">
                  Connect with students from your university and faculty.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Simple */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] bg-clip-text text-transparent">500+</p>
                <p className="text-sm text-[#5A6275] mt-2">Documents</p>
              </div>
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] bg-clip-text text-transparent">100+</p>
                <p className="text-sm text-[#5A6275] mt-2">Active Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] bg-clip-text text-transparent">50+</p>
                <p className="text-sm text-[#5A6275] mt-2">Courses</p>
              </div>
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] bg-clip-text text-transparent">24/7</p>
                <p className="text-sm text-[#5A6275] mt-2">Available</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Clean */}
        <section id="about" className="py-32 bg-[#FAFBFC]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[#3A6FF8] font-medium text-sm uppercase tracking-wider mb-4">About</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#121826] mb-6 tracking-tight">
                  Built for students,
                  <br />by students.
                </h2>
                <p className="text-[#5A6275] leading-relaxed mb-6">
                  Majestor was created to solve the everyday challenges university students face —
                  from finding reliable study materials to affordable commuting options.
                </p>
                <p className="text-[#5A6275] leading-relaxed">
                  We believe in the power of community and making campus life simpler for everyone.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#F0F2F5]">
                  <div className="w-10 h-10 rounded-full bg-[#F0F4FF] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#3A6FF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#121826]">University Verified</p>
                    <p className="text-sm text-[#5A6275]">Only verified students can access</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#F0F2F5]">
                  <div className="w-10 h-10 rounded-full bg-[#F0FDFB] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#6FD0C5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#121826]">Secure & Private</p>
                    <p className="text-sm text-[#5A6275]">Your data is always protected</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#F0F2F5]">
                  <div className="w-10 h-10 rounded-full bg-[#FFFBF0] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#FBCB43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#121826]">Fast & Reliable</p>
                    <p className="text-sm text-[#5A6275]">Optimized for performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Minimal */}
        <section className="py-32 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#121826] mb-6 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-[#5A6275] mb-10 text-lg">
              Download Majestor and join your campus community today.
            </p>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] text-white font-medium px-10 py-4 rounded-full hover:opacity-90 transition-opacity duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              Download for Android
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
