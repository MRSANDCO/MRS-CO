import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'MRS & Co. Chartered Accountants',
  description: 'MRS & Co. Chartered Accountancy firm in Ghaziabad, offers expert solutions in Income Tax Filing (ITR), GST registration & filing, company incorporation, auditing, forensic accounting and compliance services. We specialize in helping startups, small businesses, and professionals with hassle-free accounting, bookkeeping, payroll, and ROC/MCA filings. Our mission is to simplify tax and compliance, so you can focus on growing your business. With a client-first approach, transparent pricing, and timely services, we are recognized as ONE OF THE BEST CA FIRMS in Ghaziabad. Contact us for reliable tax consultancy, audit, and business registration support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}