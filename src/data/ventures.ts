import type { Venture, VentureStatus } from './types'

export const ventures: Venture[] = [
  {
    id: 'sertifikapp',
    name: 'SertifikApp',
    role: 'Founder',
    status: 'live',
    statusLabel: 'Live',
    pitch: 'A digital certificate issuance and verification platform, used for real events.',
    proof: [
      'Issued the participation certificates for the SCÜ Şarkışla BSKK Prompt Engineering workshop.',
      'Used for local events and tournaments, including the Sivas Grand Prix 25/26 and a table tennis tournament.',
      'Every certificate gets a public verification page with a unique ID.',
    ],
    url: 'https://sertifikapp.com',
    domains: ['ventures'],
    order: 1,
  },
  {
    id: 'girisimciler-net',
    name: 'girisimciler.net',
    role: 'Founder',
    status: 'standby',
    statusLabel: 'Domain / Standby',
    pitch: 'An entrepreneurship-ecosystem domain held for future ventures.',
    proof: [],
    url: null,
    domains: ['ventures'],
    order: 2,
  },
  {
    id: 'doktorgorusu',
    name: 'DoktorGörüşü.com',
    role: 'Founder',
    status: 'sunset',
    statusLabel: 'Archived / Sunset',
    pitch: 'A past local web directory for finding and contacting healthcare professionals and clinics across cities and districts.',
    proof: [],
    url: null,
    domains: ['ventures'],
    order: 3,
  },
]

export const ventureStatusOrder: Record<VentureStatus, number> = { live: 0, standby: 1, sunset: 2 }
