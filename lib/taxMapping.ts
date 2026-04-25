// lib/taxMapping.ts
import data from './data/it-mapping.json'

export type ChangeType = 'moved' | 'merged' | 'restructured' | 'consolidated' | 'schedule' | 'new'

export interface SectionDetail {
  section: string
  heading: string
  chapter: string
  text: string
}

export interface MappingEntry {
  id: string
  old: SectionDetail
  new: SectionDetail
  change_type: ChangeType
  change_summary: string
}

export const SECTIONS: MappingEntry[] = data.sections as MappingEntry[]

export const CHG_LABELS: Record<ChangeType, string> = {
  moved: 'Moved / Renumbered',
  merged: 'Merged into Another Section',
  restructured: 'Restructured / Simplified',
  consolidated: 'Consolidated',
  schedule: 'Moved to Schedule',
  new: 'New Provision',
}

// Legacy helpers kept for backward compatibility
export const oldToNew: Record<string, { new_section: string; topic: string; chapter: string; change: ChangeType; note?: string }> =
  Object.fromEntries(
    SECTIONS.map(s => [
      s.old.section,
      {
        new_section: s.new.section,
        topic: s.old.heading,
        chapter: s.old.chapter,
        change: s.change_type,
        note: s.change_summary,
      },
    ])
  )

export const newToOld: Record<string, { old_sections: string[]; topic: string; chapter: string }> =
  SECTIONS.reduce((acc, s) => {
    const key = s.new.section
    if (!acc[key]) {
      acc[key] = { old_sections: [], topic: s.new.heading, chapter: s.new.chapter }
    }
    acc[key].old_sections.push(s.old.section)
    return acc
  }, {} as Record<string, { old_sections: string[]; topic: string; chapter: string }>)
