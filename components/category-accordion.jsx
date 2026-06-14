'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CATEGORY_COLORS } from '@/lib/constants.js'

function getColor(name) {
  return CATEGORY_COLORS[name] ?? '#8E8E93'
}

export default function CategoryAccordion({ categories }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="space-y-1">
      {categories.map((cat) => {
        const color = getColor(cat.name)
        const isOpen = open === cat.name
        return (
          <div key={cat.name}>
            <button
              onClick={() => setOpen(isOpen ? null : cat.name)}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left transition-colors duration-150 cursor-pointer hover:bg-gray-50"
              style={{ background: isOpen ? '#F2F2F7' : 'transparent' }}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
              <span className="flex-1 text-sm font-medium" style={{ color: '#1C1C1E' }}>{cat.name}</span>
              <span className="text-xs tabular-nums" style={{ color: '#8E8E93' }}>{cat.events.length} events</span>
              <span className="text-sm font-semibold w-12 text-right tabular-nums" style={{ color: '#1C1C1E' }}>{cat.hours}h</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#C7C7CC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {isOpen && (
              <div className="mx-2 mb-1 mt-0.5 rounded-xl overflow-hidden" style={{ background: '#FAFAFA', border: '1px solid #F2F2F7' }}>
                {cat.events.map((e, i) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between px-3 py-2 text-xs"
                    style={{ borderBottom: i < cat.events.length - 1 ? '1px solid #F2F2F7' : 'none' }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color }} />
                      <span className="font-medium truncate" style={{ color: '#3C3C43' }}>{e.title}</span>
                    </div>
                    <span className="shrink-0 tabular-nums" style={{ color: '#AEAEB2' }}>
                      {format(new Date(e.startAt), 'EEE d MMM')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
