const RULES = [
  {
    category: 'Health',
    pattern: /gym|workout|run|running|yoga|swim|cycling|crossfit|physio|physiotherapy|doctor|dentist|therapy|therapist|meditation|pilates|hiit|weights/i,
  },
  {
    category: 'Meeting',
    pattern: /standup|stand-up|retro|retrospective|sprint|1:1|one.on.one|sync|interview|all.?hands|town.?hall|check.?in|review|planning|kickoff|debrief|catch.?up/i,
  },
  {
    category: 'Learning',
    pattern: /course|lecture|tutorial|reading|study|learn|workshop|conference|seminar|webinar|training|class|lesson/i,
  },
  {
    category: 'Family',
    pattern: /family|kids|school|pickup|drop.?off|birthday|anniversary|parent|childcare|nursery/i,
  },
  {
    category: 'Social',
    pattern: /lunch|dinner|drinks|coffee|social|party|meet|catch up|date night|happy hour|brunch/i,
  },
  {
    category: 'Admin',
    pattern: /admin|invoice|tax|accountant|bank|insurance|renewal|appointment|errands|groceries|cleaning/i,
  },
  {
    category: 'Work',
    pattern: /deep.?work|focus|build|code|coding|write|writing|design|review|pr|deploy|debug|release|project|deadline|presentation|client/i,
  },
]

export function categoriseEvent({ title, attendeeCount, calendarName }) {
  const text = `${title} ${calendarName}`.trim()

  for (const rule of RULES) {
    if (rule.pattern.test(text)) return rule.category
  }

  if (attendeeCount >= 2) return 'Meeting'

  return 'Other'
}
