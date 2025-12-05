// app/layout.tsx
"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * צבעי הפרויקט
 */
const colors = {
  primary: "text-cyan-600",
  secondary: "text-blue-500",
  accent: "text-teal-400",
  hover: "hover:text-orange-400",
};

/**
 * Header Component עם אנימציות Framer Motion
 */
const Header: React.FC = () => (
  <header className="bg-white shadow-md sticky top-0 z-50">
    <div className="container mx-auto flex items-center justify-between px-4 py-3">
      {/* לוגו עם אנימציה */}
      <Link href="/">
        <motion.div
          className="flex items-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/logo.png" // בתיקיית public
            alt="NewsSystem Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <motion.span
            className={`ml-3 font-bold text-xl ${colors.primary}`}
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            NewsSystem
          </motion.span>
        </motion.div>
      </Link>

      {/* ניווט */}
      <nav className="flex space-x-6 items-center">
        <Link href="/" className={`${colors.primary} ${colors.hover} font-medium`}>
          דף הבית
        </Link>
        <Link href="/topics" className={`${colors.secondary} ${colors.hover} font-medium`}>
          נושאים
        </Link>
        <Link href="/about" className={`${colors.accent} ${colors.hover} font-medium`}>
          אודות
        </Link>
      </nav>

      {/* כפתורי פעולה עם אנימציה */}
      <div className="flex items-center space-x-4">
        <motion.button
          className="px-4 py-2 bg-teal-400 text-white rounded-lg shadow"
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          התחבר
        </motion.button>
        <motion.button
          className="px-4 py-2 bg-orange-400 text-white rounded-lg shadow"
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          הרשמה
        </motion.button>
      </div>
    </div>
  </header>
);

/**
 * RootLayout Component
 * כולל Head עם favicon ולוגו, Header עם אנימציות
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he">
      <Head>
        <title>NewsSystem</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
