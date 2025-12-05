// app/layout.tsx
"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

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
 * Header Component
 * מופיע בכל דף ומכיל לוגו וניווט
 */
const Header: React.FC = () => (
  <header className="bg-white shadow-md sticky top-0 z-50">
    <div className="container mx-auto flex items-center justify-between px-4 py-3">
      {/* לוגו */}
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <Image
            src="/logo.png"         // בתיקיית public
            alt="NewsSystem Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <span className={`ml-3 font-bold text-xl ${colors.primary}`}>
            NewsSystem
          </span>
        </div>
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

      {/* כפתורי פעולה */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-teal-400 text-white rounded-lg shadow hover:bg-teal-500 transition-colors">
          התחבר
        </button>
        <button className="px-4 py-2 bg-orange-400 text-white rounded-lg shadow hover:bg-orange-500 transition-colors">
          הרשמה
        </button>
      </div>
    </div>
  </header>
);

/**
 * RootLayout Component
 * כולל Head, favicon, לוגו ו-HDR
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

