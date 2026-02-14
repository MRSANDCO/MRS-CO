import './globals.css'
import { Inter } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'MRS & Co. Chartered Accountants , Ghaziabad',
  description: 'MRS & Co. Chartered Accountancy firm in Ghaziabad, offers expert solutions in Income Tax Filing (ITR), GST registration & filing, company incorporation, auditing, forensic accounting and compliance services. We specialize in helping startups, small businesses, and professionals with hassle-free accounting, bookkeeping, payroll, and ROC/MCA filings. Our mission is to simplify tax and compliance, so you can focus on growing your business. With a client-first approach, transparent pricing, and timely services, we are recognized as ONE OF THE BEST CA FIRMS in Ghaziabad. Contact us for reliable tax consultancy, audit, and business registration support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=1920&auto=format&fit=crop"
          // fetchpriority="high"
        />
        
        {/* Preload navbar background */}
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
        />
        
        {/* Preload news ticker background */}
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
        />
        
        {/* Establish early connection to Unsplash */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased">
        {children}
         <SpeedInsights />
      </body>
    </html>
  )
}