import { certificationHeadline, repoStats, uniqueCertificationCount } from './selectors'
import type { Metric, Profile } from './types'

const translationStars = repoStats('Python-100-Days-Turkish')?.stars ?? 111
const certFloor = Math.floor(uniqueCertificationCount / 10) * 10

export const profile: Profile = {
  name: 'Himmet Can Umutlu',
  displayName: 'H. Can Umutlu',
  givenName: 'Himmet Can',
  familyName: 'Umutlu',
  headline: 'AI & Cloud builder who starts things from zero: local-first AI tools, student tech communities, and ventures.',
  roleLine: 'Information Systems & Technologies student · AI & Software Engineering',
  bio: [
    "I'm an Information Systems student at Sivas Cumhuriyet University, with a second degree in International Entrepreneurship at Istanbul University, who builds privacy-first AI and the communities that learn it.",
    'I founded my campus chapter of Huawei Student Developers, help run the AWS Student Builder Group, and ship open-source tools used well beyond my campus.',
  ],
  location: 'Kadıköy, İstanbul, Türkiye',
  email: 'himmetcanumutlu.business@gmail.com',
  availability: 'Open to new opportunities',
  identityChips: [
    { label: 'AI Builder', domain: 'ai' },
    { label: 'Cloud', domain: 'cloud' },
    { label: 'Community Founder', domain: 'community' },
  ],
  now: [
    { role: 'Executive Board VP (Mentoring)', org: 'HSD Sivas Cumhuriyet', domain: 'community' },
    { role: 'Founding Core Team', org: 'AWS Student Builder Group', domain: 'cloud' },
    { role: 'Founder', org: 'SertifikApp', domain: 'ventures' },
  ],
  headshot: {
    src: '/assets/img/headshot.jpg',
    alt: 'Portrait of H. Can Umutlu',
    width: 640,
    height: 640,
  },
  cv: { href: '/assets/docs/cv.pdf', label: 'Download CV (PDF)' },
  links: {
    github: { label: 'GitHub', href: 'https://github.com/himmetcanumutlu', kind: 'github' },
    linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/himmetcanumutlu', kind: 'linkedin' },
    youtube: { label: 'YouTube', href: 'https://www.youtube.com/@hcanumutlu', kind: 'youtube' },
    email: { label: 'Email', href: 'mailto:himmetcanumutlu.business@gmail.com', kind: 'email' },
  },
  languages: [
    { name: 'Turkish', level: 'Native' },
    { name: 'English', level: 'Professional working proficiency' },
  ],
  beyondTech: [
    'Regular voluntary blood donor with Türk Kızılay since 2023.',
    'Volunteer staff at Diva Conference, TEKNOFEST İstanbul and T3 Foundation Robolimpics.',
  ],
}

/** Proof strip. `value` drives the count-up; `display` is the static fallback. */
export const proofMetrics: Metric[] = [
  {
    id: 'microsoft',
    value: null,
    display: "Microsoft AI Intern '26",
    label: 'AI Innovators Summer Program',
    domain: 'ai',
  },
  {
    id: 'hccda-ai',
    value: null,
    display: 'HCCDA–AI',
    label: 'Huawei Cloud Certified AI Developer',
    domain: 'cloud',
  },
  {
    id: 'oss-stars',
    value: translationStars,
    display: `${translationStars}★`,
    suffix: '★',
    label: 'GitHub stars · Python-100-Days-Turkish',
    detail: 'Adopted by the Elginkan Foundation’s Python training',
    domain: 'community',
  },
  {
    id: 'yzta',
    value: 1500,
    display: '1 of 1,500',
    prefix: '1 of ',
    label: 'Selected from 31,700 applicants',
    detail: 'Yapay Zeka ve Teknoloji Akademisi',
    domain: 'academic',
  },
  {
    id: 'followers',
    value: 6,
    display: '6K+',
    suffix: 'K+',
    label: 'LinkedIn followers',
    domain: 'community',
  },
  {
    id: 'certs',
    value: certFloor,
    display: certificationHeadline,
    suffix: '+',
    label: 'Certifications',
    detail: 'Huawei · Google · IBM · NVIDIA · P&G',
    domain: 'academic',
  },
]
