"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.majestor.app";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const features = [
  {
    title: "Carpool",
    tagline: "Get to campus, together.",
    description:
      "Post a ride or book one with verified students from your university. Chat with drivers, track requests, and split costs — all in one place.",
    bullets: [
      "Post rides with seats, route & fare",
      "Book seats and chat with the driver",
      "Real-time ride requests and approvals",
    ],
    gradient: "from-[#3A6FF8] to-[#5B8DFA]",
    bg: "bg-[#EEF3FF]",
    iconColor: "text-[#3A6FF8]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 17l4 4 4-4m-4-5v9M3 4h18M5 4v8a4 4 0 004 4h6a4 4 0 004-4V4"
      />
    ),
  },
  {
    title: "Study Hub",
    tagline: "Notes, past papers, projects.",
    description:
      "Upload past papers, lecture notes, assignments, and projects. Browse a personal vault or share with your university community.",
    bullets: [
      "Personal vault & public document library",
      "Filter by course, type, semester, year",
      "Like and save the resources you need",
    ],
    gradient: "from-[#6FD0C5] to-[#8DDDD3]",
    bg: "bg-[#E8F9F7]",
    iconColor: "text-[#22B5A6]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
  {
    title: "Study Groups",
    tagline: "Learn with the right people.",
    description:
      "Create or join study groups for your courses. Chat in real time, share documents in the group, and invite classmates directly.",
    bullets: [
      "Public, private & official groups",
      "Real-time group chat over WebSocket",
      "Invite classmates by username",
    ],
    gradient: "from-[#7B1FA2] to-[#A347C7]",
    bg: "bg-[#F3E5F5]",
    iconColor: "text-[#7B1FA2]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    ),
  },
  {
    title: "Smart Notifications",
    tagline: "Never miss a thing.",
    description:
      "Get push notifications when someone books your ride, invites you to a study group, or messages you.",
    bullets: [
      "Booking accepted / rejected alerts",
      "Study group invites & accepts",
      "New messages and group activity",
    ],
    gradient: "from-[#E65100] to-[#FB8C00]",
    bg: "bg-[#FFF3E0]",
    iconColor: "text-[#E65100]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    ),
  },
  {
    title: "University Verified",
    tagline: "A trusted community.",
    description:
      "Sign up only with your university email. Every student is verified, so you always know who you're sharing rides and notes with.",
    bullets: [
      "University-domain email required",
      "Email verification before access",
      "Verified faculty role for instructors",
    ],
    gradient: "from-[#2E7D32] to-[#4CAF50]",
    bg: "bg-[#E8F5E9]",
    iconColor: "text-[#2E7D32]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    title: "Direct Chat",
    tagline: "Talk to anyone, instantly.",
    description:
      "One-on-one chat with ride drivers and group chat for study groups. Built on WebSockets for instant delivery.",
    bullets: [
      "1-on-1 carpool chat",
      "Group chat for study groups",
      "Live online status indicator",
    ],
    gradient: "from-[#3A6FF8] to-[#6FD0C5]",
    bg: "bg-[#EEF7FF]",
    iconColor: "text-[#3A6FF8]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="flex-1 overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center"
      >
        {/* Animated gradient orbs */}
        <motion.div
          aria-hidden
          className="absolute top-20 right-[15%] w-[520px] h-[520px] bg-[#3A6FF8]/10 rounded-full blur-[110px] pointer-events-none"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-10 left-[10%] w-[420px] h-[420px] bg-[#6FD0C5]/15 rounded-full blur-[110px] pointer-events-none"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FBCB43]/10 rounded-full blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-[#E6ECFF] bg-white/80 backdrop-blur-sm text-[#3A6FF8] px-5 py-2.5 rounded-full text-sm font-medium mb-8"
          >
            <motion.span
              className="w-1.5 h-1.5 bg-[#3A6FF8] rounded-full"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            For University Students
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#121826] leading-[1.1] mb-6 tracking-tight"
          >
            Your Campus Life,
            <br />
            <span className="bg-gradient-to-r from-[#3A6FF8] via-[#6FD0C5] to-[#3A6FF8] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
              Unified.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg md:text-xl text-[#5A6275] mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Carpool with classmates, share notes & past papers, and join study
            groups — all from one app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#121826] text-white font-medium px-8 py-4 rounded-full shadow-lg shadow-[#121826]/20 hover:shadow-xl hover:shadow-[#3A6FF8]/30 transition-shadow"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              Get on Google Play
            </motion.a>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 text-[#5A6275] font-medium px-8 py-4 rounded-full border border-[#E6ECF5] hover:border-[#3A6FF8] hover:text-[#3A6FF8] transition-colors"
              >
                Explore features
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating phone mockup hint */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-20 inline-flex items-center gap-3 text-xs text-[#5A6275]/70"
          >
            <motion.svg
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
            Scroll to see what&apos;s inside
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section
        id="features"
        className="py-32 bg-gradient-to-b from-white to-[#FAFBFC] relative"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#3A6FF8] font-medium text-sm uppercase tracking-wider mb-4"
            >
              Features
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-bold text-[#121826] tracking-tight mb-4"
            >
              Everything campus life needs
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[#5A6275] max-w-xl mx-auto"
            >
              Six tools, one app, made for the way students actually live and
              study.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative p-8 rounded-3xl bg-white border border-[#F0F2F5] hover:border-transparent hover:shadow-2xl hover:shadow-[#3A6FF8]/10 transition-all duration-300 overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`}
                />

                <div
                  className={`relative w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <svg
                    className={`w-7 h-7 ${f.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {f.icon}
                  </svg>
                </div>

                <p
                  className={`text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${f.gradient} bg-clip-text text-transparent mb-2`}
                >
                  {f.tagline}
                </p>
                <h3 className="text-xl font-bold text-[#121826] mb-3">
                  {f.title}
                </h3>
                <p className="text-[#5A6275] text-sm leading-relaxed mb-5">
                  {f.description}
                </p>

                <ul className="space-y-2">
                  {f.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-xs text-[#5A6275]"
                    >
                      <svg
                        className={`w-4 h-4 ${f.iconColor} flex-shrink-0 mt-0.5`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────────── */}
      <section id="about" className="py-32 bg-[#FAFBFC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[#3A6FF8] font-medium text-sm uppercase tracking-wider mb-4">
                About
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#121826] mb-6 tracking-tight">
                Built for students,
                <br />
                by students.
              </h2>
              <p className="text-[#5A6275] leading-relaxed mb-6">
                Majestor was created to solve the everyday challenges
                university students face — from finding reliable study
                materials to affordable commuting options.
              </p>
              <p className="text-[#5A6275] leading-relaxed">
                We believe in the power of community and making campus life
                simpler for everyone.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-4"
            >
              {[
                {
                  title: "University Verified",
                  desc: "Only verified students can access",
                  bg: "#F0F4FF",
                  color: "#3A6FF8",
                  d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  title: "Secure & Private",
                  desc: "Your data is always protected",
                  bg: "#F0FDFB",
                  color: "#6FD0C5",
                  d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                },
                {
                  title: "Fast & Reliable",
                  desc: "Optimized for performance",
                  bg: "#FFFBF0",
                  color: "#FBCB43",
                  d: "M13 10V3L4 14h7v7l9-11h-7z",
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#F0F2F5] hover:shadow-lg hover:shadow-[#3A6FF8]/5 transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: card.bg }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: card.color }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={card.d}
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#121826]">{card.title}</p>
                    <p className="text-sm text-[#5A6275]">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-32 bg-white relative overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(58,111,248,0.08) 0%, rgba(111,208,197,0.04) 50%, transparent 80%)",
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#121826] mb-6 tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-[#5A6275] mb-10 text-lg">
            Download Majestor and join your campus community today.
          </p>
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#3A6FF8] to-[#6FD0C5] text-white font-medium px-10 py-4 rounded-full shadow-xl shadow-[#3A6FF8]/30 hover:shadow-2xl hover:shadow-[#3A6FF8]/40 transition-shadow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
            </svg>
            Download for Android
          </motion.a>
        </motion.div>
      </section>
    </main>
  );
}
