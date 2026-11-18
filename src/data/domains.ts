import { DOMAIN_IDS, type Domain, type DomainId } from './types'

export const domains: Domain[] = [
  {
    id: 'ai',
    label: 'AI & ML',
    shortLabel: 'AI',
    claim: 'Local-first LLM, RAG and computer-vision systems that keep data on your own machine.',
    proofs: ['Microsoft AI Intern 2026', 'HCCDA–AI', 'YOLOv8 on BDD100K'],
    size: 'lg',
  },
  {
    id: 'community',
    label: 'Community & Leadership',
    shortLabel: 'Community',
    claim: 'Student tech communities founded from zero, led, and handed on to the next team.',
    proofs: ['Founder, HSD Sivas Cumhuriyet', 'Prompt Engineering workshop, 3rd year', '111★ open-source translation'],
    size: 'lg',
  },
  {
    id: 'cloud',
    label: 'Cloud',
    shortLabel: 'Cloud',
    claim: 'Huawei Cloud certified and building the AWS student ecosystem on campus.',
    proofs: ['HCCDP–GaussDB', 'AWS Student Builder Group', 'Huawei Cloud Acceleration Program'],
    size: 'md',
  },
  {
    id: 'systems',
    label: 'Security & Systems',
    shortLabel: 'Systems',
    claim: 'A 24/7 self-hosted Ubuntu homelab behind Zero Trust tunnels, plus security tooling.',
    proofs: ['Cloudflare Zero Trust', 'Teknofest KKTC semi-finalist', 'CÜSİBER'],
    size: 'md',
  },
  {
    id: 'ventures',
    label: 'Ventures & Product',
    shortLabel: 'Ventures',
    claim: 'Zero-to-one products: a live certificate platform and browser tools people install.',
    proofs: ['SertifikApp (live)', 'YT Refined v1.7', 'Google PM Certificate'],
    size: 'sm',
  },
  {
    id: 'academic',
    label: 'Academic',
    shortLabel: 'Academic',
    claim: 'A dual-degree track: Information Systems + International Entrepreneurship.',
    proofs: ['Sivas Cumhuriyet University', 'Istanbul University (AUZEF)', '40+ certifications'],
    size: 'sm',
  },
]

export const isDomainId = (value: unknown): value is DomainId =>
  typeof value === 'string' && (DOMAIN_IDS as readonly string[]).includes(value)

export const domainById = (id: DomainId): Domain => {
  const domain = domains.find(d => d.id === id)
  if (!domain) throw new Error(`Unknown domain: ${id}`)
  return domain
}
