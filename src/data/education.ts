import type { Degree, Program } from './types'

export const degrees: Degree[] = [
  {
    id: 'scu-ist',
    institution: 'Sivas Cumhuriyet University',
    program: 'Information Systems and Technologies',
    degree: "Bachelor's degree",
    years: '2023 – 2027',
    domains: ['academic', 'ai'],
    highlights: [
      'AI course term project: YOLOv8 traffic-light detection on BDD100K.',
      'Automatic Control finals: Unity feedback-loop simulation.',
      'Web Programming II: Django application.',
    ],
    relatedProjects: ['yolov8-traffic-lights', 'unity-control-sim', 'django-midterm'],
  },
  {
    id: 'iu-auzef',
    institution: 'Istanbul University',
    program: 'International Entrepreneurship',
    degree: "Bachelor's degree",
    years: '2024 – 2028',
    mode: 'Faculty of Open and Distance Education (AUZEF)',
    domains: ['academic', 'ventures'],
    highlights: ['Second degree, pursued alongside Information Systems to pair engineering with product and business thinking.'],
    relatedProjects: [],
  },
]

export const programs: Program[] = [
  {
    id: 'microsoft-ai-innovators',
    name: 'AI Innovators Summer Program',
    provider: 'Microsoft',
    year: 2026,
    detail: 'Artificial Intelligence internship · local LLM deployment',
    domains: ['ai'],
  },
  {
    id: 'yzta',
    name: 'Yapay Zeka ve Teknoloji Akademisi',
    provider: 'Google',
    year: 2026,
    detail: 'No-Code / Low-Code track · 1 of 1,500 from 31,700 applicants',
    domains: ['ai', 'academic'],
  },
  {
    id: 'huawei-cloud-acceleration',
    name: 'Huawei Cloud Acceleration Program',
    provider: 'Huawei',
    year: 2025,
    detail: 'Cloud applications & solution architecture',
    domains: ['cloud'],
  },
  {
    id: 'ibm-ai-agents-bootcamp',
    name: 'AI Agents Bootcamp',
    provider: 'IBM SkillsBuild',
    year: 2026,
    detail: 'Agentic AI fundamentals and applications',
    domains: ['ai'],
  },
  {
    id: 'pg-leader-in-you',
    name: 'Leader In You',
    provider: 'Procter & Gamble',
    year: 2025,
    detail: 'Leadership, brand and strategy',
    domains: ['community', 'ventures'],
  },
]
