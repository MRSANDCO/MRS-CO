'use client'
import { ArrowRight, Search } from 'lucide-react'

export default function IncomeTaxNavigatorCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="rounded-xl bg-blue-50 p-3">
          <Search className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
          Live from Apr 2026
        </span>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1">
        Income Tax Section Mapper
      </h3>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">
        Instantly find any section from the old ITA 1961 in the new Income Tax Act 2025 — and vice versa.
      </p>

      <div className="flex items-center gap-3 text-xs text-slate-400 mb-5">
        <span>819 → 536 sections</span>
        <span>·</span>
        <span>Bidirectional</span>
        <span>·</span>
        <span>ICAI sourced</span>
      </div>

      <a
        href="https://share.google/ltDlm59gGOrMEStoX"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Open mapper <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  )
}