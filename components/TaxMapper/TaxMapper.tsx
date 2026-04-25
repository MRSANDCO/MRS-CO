// components/TaxMapper/TaxMapper.tsx
'use client'
import { useMemo, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { SECTIONS, CHG_LABELS } from '@/lib/taxMapping'

type Mode = 'old' | 'new' | 'all'

export default function TaxMapper() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const query = searchParams.get('q') ?? ''
  const mode = (searchParams.get('mode') ?? 'all') as Mode
  
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, val]) => {
      if (val) params.set(key, val)
      else params.delete(key)
    })
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    return SECTIONS.filter(s => {
      if (!q) return true
      if (mode === 'old') {
        return s.old.section.toLowerCase().includes(q)
      } else if (mode === 'new') {
        return s.new.section.toLowerCase().includes(q)
      } else {
        return (
          s.old.section.toLowerCase().includes(q) ||
          s.new.section.toLowerCase().includes(q) ||
          s.old.heading.toLowerCase().includes(q) ||
          s.new.heading.toLowerCase().includes(q) ||
          s.old.text.toLowerCase().includes(q) ||
          s.new.text.toLowerCase().includes(q) ||
          s.change_summary.toLowerCase().includes(q)
        )
      }
    })
  }, [query, mode])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar / List View */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Income-tax Act 1961 vs 2025</h1>
        
        {/* Mode Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(['all', 'old', 'new'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => updateParams({ mode: m, q: query })}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === m ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === 'all' ? 'Keyword' : m === 'old' ? 'Old §' : 'New §'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          placeholder={mode === 'old' ? 'Search old section...' : mode === 'new' ? 'Search new section...' : 'Search any keyword...'}
          onChange={e => updateParams({ q: e.target.value })}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
        />

        <p className="text-sm text-gray-500">{results.length} sections found</p>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] border rounded-lg divide-y bg-white shadow-sm">
          {results.map((s) => (
            <div 
              key={s.id} 
              onClick={() => setSelectedSection(s.id)}
              className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedSection === s.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-700">§{s.old.section}</span>
                <span className="text-gray-400">→</span>
                <span className="font-semibold text-blue-600">§{s.new.section}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{s.old.heading}</p>
              <div className="mt-2">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {CHG_LABELS[s.change_type]}
                </span>
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <div className="p-4 text-center text-gray-500">No matching sections found.</div>
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-full md:w-2/3">
        {selectedSection ? (() => {
          const sec = SECTIONS.find(s => s.id === selectedSection)!
          return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{sec.new.heading}</h2>
                    <div className="flex items-center gap-3 text-blue-100 text-sm">
                      <span className="bg-white/20 px-2 py-1 rounded">1961: §{sec.old.section}</span>
                      <span>→</span>
                      <span className="bg-white/20 px-2 py-1 rounded">2025: §{sec.new.section}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold px-3 py-1 bg-white text-blue-700 rounded-full shadow-sm">
                    {CHG_LABELS[sec.change_type]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-800 uppercase mb-2">What Changed?</h3>
                  <p className="text-blue-900 leading-relaxed">{sec.change_summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Old Act */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <span className="text-xl">📜</span>
                      <h3 className="font-bold text-gray-700">Income-tax Act, 1961</h3>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{sec.old.chapter}</div>
                      <div className="font-medium text-gray-800 mb-3">Section {sec.old.section}: {sec.old.heading}</div>
                      <div className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg border">
                        {sec.old.text}
                      </div>
                    </div>
                  </div>

                  {/* New Act */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <span className="text-xl">📗</span>
                      <h3 className="font-bold text-green-700">Income-tax Act, 2025</h3>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{sec.new.chapter}</div>
                      <div className="font-medium text-gray-800 mb-3">Section {sec.new.section}: {sec.new.heading}</div>
                      <div className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-green-50 p-4 rounded-lg border border-green-100">
                        {sec.new.text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })() : (
          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 h-full flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
            <span className="text-4xl mb-4">⚖️</span>
            <p className="text-lg">Select a section from the list to view detailed comparison.</p>
          </div>
        )}
      </div>

    </div>
  )
}