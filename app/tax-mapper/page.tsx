// app/tax-mapper/page.tsx  (App Router)
import { Suspense } from 'react'
import TaxMapper from '@/components/TaxMapper/TaxMapper'

export const metadata = {
  title: 'Income Tax Section Mapper — ITA 1961 ↔ 2025',
  description: 'Bidirectional lookup for every section of the Income Tax Act 1961 mapped to the new Income Tax Act 2025'
}

export default function TaxMapperPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaxMapper />
    </Suspense>
  )
}