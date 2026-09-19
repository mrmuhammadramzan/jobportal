import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/Toast";
/* Fonts: use system fonts stack — no Google Fonts dependency.
   LESSON: Always use local/system fonts in dev to avoid network failures. */

const geistSans = { variable: "--font-geist-sans", className: "" };
const geistMono = { variable: "--font-geist-mono", className: "" };

export const metadata: Metadata = {
  title: "RozeDesk — Find Jobs & Hire Talent in Pakistan",
  description:
    "Browse thousands of jobs across Pakistan. Register free, apply in one click, or post a job listing to find your next hire.",
  keywords: ["jobs in pakistan", "job board", "find jobs", "post a job", "hiring", "RozeDesk"],
  openGraph: {
    title: "RozeDesk — Find Jobs & Hire Talent in Pakistan",
    description: "Browse jobs, register free, apply in one click. Employers post listings and find talent fast.",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Font Awesome 6 Free — single CDN load for all fa- icon classes */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/*
          Theme init script — BLOCKING, runs before first paint.
          Reads localStorage → sets data-theme on <html> immediately.
          This prevents FOUC (Flash Of Unstyled Content) when the user
          has a saved preference.

          Must be inline (not deferred) so it runs synchronously before
          the browser renders any styled content.
          suppressHydrationWarning on <html> is required because this
          script mutates the DOM before React hydrates.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rozedesk-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}else{var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=dark?'dark':'light';document.documentElement.setAttribute('data-theme',d);document.documentElement.style.colorScheme=d;}}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
