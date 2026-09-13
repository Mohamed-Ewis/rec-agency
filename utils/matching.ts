import type { AiMatch, Candidate, Job } from '~/types'

function sameSkill(a: string, b: string) {
  const left = a.toLowerCase()
  const right = b.toLowerCase()
  return left === right || left.includes(right) || right.includes(left)
}

export function scoreMatch(candidate: Candidate, job: Job): AiMatch {
  const matchedSkills = job.mustHave.filter(skill => candidate.skills.some(item => sameSkill(item, skill)))
  const missingSkills = job.mustHave.filter(skill => !matchedSkills.some(item => sameSkill(item, skill)))
  const niceHits = job.niceToHave.filter(skill => candidate.skills.some(item => sameSkill(item, skill)))

  let score = job.mustHave.length ? Math.round((matchedSkills.length / job.mustHave.length) * 68) : 42
  score += Math.min(16, niceHits.length * 4)

  const inBand = candidate.salaryExpectation >= job.salaryMin && candidate.salaryExpectation <= job.salaryMax + 8000
  if (inBand) score += 10
  else if (candidate.salaryExpectation > job.salaryMax + 15000) score -= 10

  const locationHit = candidate.location.split(',')[0] && job.location.toLowerCase().includes(candidate.location.split(',')[0].toLowerCase())
  if (locationHit || job.workMode === 'remote') score += 6

  score = Math.max(18, Math.min(98, score))

  const explanation = missingSkills.length
    ? `${matchedSkills.length}/${job.mustHave.length} must-haves match. Gap: ${missingSkills.join(', ')}. Review before you send or submit.`
    : `All must-haves overlap. Salary ${inBand ? 'is inside' : 'needs a conversation on'} the band.`

  const nextAction = score >= 80
    ? 'Send the job to the seeker, then add them to the client pipeline.'
    : score >= 60
      ? 'Screen on the missing skills, then send if the story holds.'
      : 'Do not send yet — keep as a nurture or a different brief.'

  return { score, matchedSkills, missingSkills, explanation, nextAction }
}

export function draftJobOutreach(candidate: Candidate, job: Job, clientName: string) {
  const first = candidate.firstName
  return {
    subject: `${job.title} at ${clientName} — thought of you`,
    body: `Hi ${first},\n\nWe are representing ${clientName} on a ${job.title} (${job.location}, ${job.workMode}). The brief asks for ${job.mustHave.slice(0, 3).join(', ')} and the band is £${Math.round(job.salaryMin / 1000)}–${Math.round(job.salaryMax / 1000)}k.\n\nIf this is close to what you want next, reply and I will walk you through the role before anything goes to the client.\n\nBest`
  }
}
