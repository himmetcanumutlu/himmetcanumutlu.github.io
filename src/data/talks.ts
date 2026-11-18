import type { Talk } from './types'

export const talks: Talk[] = [
  {
    id: 'ai-agents-2026',
    title: 'Autonomous AI Agents and Tool Integration: From Text Completion to Autonomous Action',
    series: 'Prompt Engineering Workshop',
    edition: '3rd edition',
    host: 'Şarkışla Science, Art & Culture Club',
    year: 2026,
    format: 'Workshop session · ~25–30 min',
    domains: ['ai', 'community'],
    summary:
      'How LLMs evolved from passive text generators into goal-driven agents that reason, plan and act through external tools, and how to keep them safe.',
    topics: [
      'Chatbot vs. AI agent',
      'Anatomy of an agent: LLM, memory, planning, tools',
      'Models don’t execute code; they generate parameters',
      'Function calling & JSON Schema tool contracts',
      'ReAct: Thought → Act → Observation',
      'Error recovery & self-correction',
      'Guardrails: max iterations, budgets, human-in-the-loop',
    ],
    links: [
      { label: 'Slides & notes', href: 'https://github.com/himmetcanumutlu/Prompt_Engineering_Keynote_2026', kind: 'slides' },
    ],
  },
]
