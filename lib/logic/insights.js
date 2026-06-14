import { format } from 'date-fns'

export function detectPatterns(stats) {
  const patterns = []

  if (stats.meetingPct > 50) {
    patterns.push(`Over half your tracked time (${stats.meetingPct}%) was in meetings.`)
  } else if (stats.meetingPct < 20 && stats.totalHours > 5) {
    patterns.push(`Low meeting load — ${stats.meetingPct}% of your week was in meetings, leaving good space for focused work.`)
  }

  if (stats.busiestDay) {
    patterns.push(`${stats.busiestDay} was your busiest day.`)
  }

  if (stats.categoryBreakdown['Health']) {
    patterns.push(`You logged ${stats.categoryBreakdown['Health']}h of health-related activity — great habit.`)
  }

  if (stats.focusHours >= 10) {
    patterns.push(`Strong focus time: ${stats.focusHours}h of deep work logged.`)
  } else if (stats.focusHours > 0 && stats.focusHours < 5) {
    patterns.push(`Focus time was low this week — only ${stats.focusHours}h of deep work.`)
  }

  if (stats.categoryBreakdown['Learning']) {
    patterns.push(`You invested ${stats.categoryBreakdown['Learning']}h in learning.`)
  }

  return patterns.slice(0, 4)
}

export function buildRecommendations(stats) {
  const recs = []

  if (stats.meetingPct > 40) {
    recs.push('Consider batching meetings on 2–3 days to protect longer focus blocks.')
  }
  if (!stats.categoryBreakdown['Health']) {
    recs.push('No health events this period — even a 30-min walk counts.')
  }
  if (stats.focusHours < 8 && stats.totalHours > 10) {
    recs.push('Try scheduling at least one 2-hour deep work block per day before noon.')
  }
  if (!stats.categoryBreakdown['Learning']) {
    recs.push('No learning time logged — consider blocking 30 min for reading or a course.')
  }

  return recs.slice(0, 3)
}

export function buildSummary(stats, period, start, end) {
  const dateRange = period === 'weekly'
    ? `${format(start, 'MMM d')}–${format(end, 'MMM d')}`
    : format(start, 'MMMM yyyy')

  if (stats.totalHours === 0) {
    return `No calendar events were tracked for ${dateRange}.`
  }

  const topCat = Object.entries(stats.categoryBreakdown).sort((a, b) => b[1] - a[1])[0]
  const topCatStr = topCat ? ` Most time went to ${topCat[0]} (${topCat[1]}h).` : ''

  return `You tracked ${stats.totalHours}h across ${stats.eventCount} events during ${dateRange}.${topCatStr} Meeting load was ${stats.meetingPct}% of total time.`
}
