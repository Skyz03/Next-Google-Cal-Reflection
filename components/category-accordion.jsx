'use client'

import { useState } from 'react'
import { format } from 'date-fns'

const CATEGORY_COLORS = {
  Health:   '#34D399',
  Meeting:  '#818CF8',
  Work:     '#60A5FA',
  Learning: '#FBBF24',
  Social:   '#F472B6',
  Family:   '#FB923C',
  Admin:    '#A78BFA',
  Other:    '#94A3B8',
}

function getColor(name) {
  return CATEGORY_COLORS[name] ?? '#94A3B8'
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
              className="w-full flex items-center gap-3 py-2.5 px-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer"
              style={{
                background: isOpen ? `${color}0D` : 'transparent',
                border: isOpen ? `1px solid ${color}20` : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Color indicator */}
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
              />

              <span className="flex-1 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {cat.name}
              </span>

              {/* Count badge */}
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                style={{ background: `${color}15`, color }}
              >
                {cat.events.length}
              </span>

              {/* Hours */}
              <span className="text-sm font-bold w-12 text-right" style={{ color: '#F1F5F9' }}>
                {cat.hours}h
              </span>

              {/* Chevron */}
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1)', flexShrink: 0 }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Expanded event list */}
            {isOpen && (
              <div
                className="mx-2 mb-1.5 mt-0.5 rounded-xl overflow-hidden"
                style={{ border: `1px solid ${color}15`, background: 'rgba(0,0,0,0.15)' }}
              >
                {cat.events
                  .slice()
                  .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
                  .map((e, i) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between px-3 py-2 text-xs"
                      style={{
                        borderBottom: i < cat.events.length - 1 ? `1px solid rgba(255,255,255,0.05)` : 'none',
                      }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color }} />
                        <span className="font-medium truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>{e.title}</span>
                      </div>
                      <span className="shrink-0 font-mono text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.25)' }}>
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
