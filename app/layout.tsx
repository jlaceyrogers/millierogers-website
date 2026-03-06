import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoader from "@/components/PageLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Millie Rogers - Art Portfolio",
  description: "Explore the art portfolio of Millie Rogers featuring still photos, portraits, and landscapes.",
  keywords: ["art", "portfolio", "photography", "still photos", "portraits", "landscapes", "Millie Rogers"],
  authors: [{ name: "Millie Rogers" }],
  openGraph: {
    title: "Millie Rogers - Art Portfolio",
    description: "Explore the art portfolio of Millie Rogers featuring still photos, portraits, and landscapes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          {/* Skip to main content link for keyboard users */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-blue focus:text-white focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
          >
            Skip to main content
          </a>
          <PageLoader />
          <header>
            <Navigation />
          </header>
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <footer className="bg-light-bg py-8 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Millie Rogers. All rights reserved.</p>
          </footer>
        </ErrorBoundary>
      </body>
    </html>
  );
}
