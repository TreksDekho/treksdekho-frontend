import type { Metadata } from 'next';
import { Syne, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AppShell from '@/components/layout/AppShell';
import Script from 'next/script';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'TreksDekho — The Sahyadris, Finally Decoded',
  description: 'Find, book and trek the Sahyadris safely. Verified operators, transparent pricing, monsoon-ready treks from Pune.',
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <head>
        {/* Microsoft Clarity — free heatmaps + session recordings */}
        {CLARITY_ID && (
          <Script id="clarity" strategy="afterInteractive">{`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}</Script>
        )}
      </head>
      <body className="font-body">
        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
        <AppShell>{children}</AppShell>
        <Toaster position="top-right" toastOptions={{ className: 'rounded-xl text-sm' }} />
      </body>
    </html>
  );
}
