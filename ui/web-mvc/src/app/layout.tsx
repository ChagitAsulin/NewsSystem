// app/layout.tsx
"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Project colors
 */
const colors = {
  primary: "text-cyan-600",
  secondary: "text-blue-500",
  accent: "text-teal-500",
  hover: "hover:text-orange-400",
};

/**
 * Header Component with Framer Motion animations
 */
const Header: React.FC = () => (
  <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8 lg:py-5">
      {/* Logo with animation */}
      <Link href="/">
        <motion.div
          className="flex items-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Image
            src="/logo.png" // in public folder
            alt="NewsSystem Logo"
            width={52}
            height={52}
            className="rounded-full shadow-sm"
          />
          <motion.span
            className={`ml-3 text-2xl lg:text-3xl font-extrabold tracking-tight ${colors.primary}`}
            whileHover={{ rotate: 3 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            NewsSystem
          </motion.span>
        </motion.div>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className={`${colors.primary} ${colors.hover} text-sm lg:text-base font-medium`}
        >
          Home
        </Link>
        <Link
          href="/topics"
          className={`${colors.secondary} ${colors.hover} text-sm lg:text-base font-medium`}
        >
          Topics
        </Link>
        <Link
          href="/about"
          className={`${colors.accent} ${colors.hover} text-sm lg:text-base font-medium`}
        >
          About
        </Link>
      </nav>

      {/* Action buttons with animation */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        <motion.button
          className="rounded-full border border-teal-400 px-4 py-2 text-sm lg:text-base font-medium text-teal-600 shadow-sm hover:bg-teal-50"
          whileHover={{ scale: 1.05, boxShadow: "0px 12px 25px rgba(0,0,0,0.10)" }}
          whileTap={{ scale: 0.95 }}
        >
          Sign in
        </motion.button>
        <motion.button
          className="rounded-full bg-orange-400 px-5 py-2.5 text-sm lg:text-base font-semibold text-white shadow-md hover:bg-orange-500"
          whileHover={{ scale: 1.05, boxShadow: "0px 14px 30px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.95 }}
        >
          Get started
        </motion.button>
      </div>
    </div>
  </header>
);

/**
 * RootLayout Component
 * Includes Head with favicon, Header with animations, and main content wrapper
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>NewsSystem</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body className="bg-slate-50 min-h-screen text-slate-900">
        <Header />
        <main className="mx-auto max-w-6xl px-4 pt-6 pb-12 lg:px-8 lg:pt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
