import type { SystemsLab } from './types'

// Hostnames and addresses are intentionally generic; no real internal
// network details are published.

export const systemsLab: SystemsLab = {
  summary:
    'A repurposed ThinkPad runs 24/7 as a home server. It is reachable from anywhere through Cloudflare Zero Trust, without a single forwarded port.',
  topology: {
    nodes: [
      { id: 'internet', label: 'Internet', detail: 'Remote access from anywhere', kind: 'internet' },
      { id: 'cloudflare', label: 'Cloudflare Zero Trust', detail: 'SSH tunnel · no port forwarding', kind: 'edge' },
      { id: 'server', label: 'ThinkPad X250', detail: 'Ubuntu Server · 24/7', kind: 'server' },
      { id: 'switch', label: 'TP-Link TL-SG108E', detail: 'Managed switch · segmented LAN', kind: 'network' },
      { id: 'lan', label: 'Home LAN', detail: 'Workstations & devices', kind: 'device' },
    ],
    links: [
      { from: 'internet', to: 'cloudflare', label: 'identity-aware access' },
      { from: 'cloudflare', to: 'server', label: 'outbound-only tunnel' },
      { from: 'server', to: 'switch' },
      { from: 'switch', to: 'lan' },
    ],
  },
  cards: [
    {
      id: 'server',
      title: 'Home server',
      items: [
        { label: 'Hardware', value: 'Lenovo ThinkPad X250, repurposed' },
        { label: 'OS', value: 'Ubuntu Server' },
        { label: 'Uptime', value: 'Always on, 24/7' },
      ],
    },
    {
      id: 'ops',
      title: 'Operations',
      items: [
        { label: 'Management', value: 'Cockpit web console' },
        { label: 'Processes', value: 'PM2 process manager' },
      ],
    },
    {
      id: 'network',
      title: 'Network & security',
      items: [
        { label: 'Remote access', value: 'Cloudflare Zero Trust SSH tunnels' },
        { label: 'Exposure', value: 'No port forwarding' },
        { label: 'LAN', value: 'Segmented with a TP-Link TL-SG108E managed switch' },
      ],
    },
    {
      id: 'workstations',
      title: 'Workstations & mobile lab',
      items: [
        { label: 'Daily driver', value: 'Lenovo ThinkPad X1 Carbon · Windows 10/11' },
        { label: 'Mobile dev', value: 'Android · Termux + code-server' },
      ],
    },
  ],
  relatedProjects: ['phishblock', 'touchpad-scripts', 'aws-notes'],
  terminal: {
    user: 'can',
    host: 'homelab',
    bootScript: [
      { kind: 'cmd', text: 'whoami' },
      { kind: 'accent', text: 'H. Can Umutlu — AI & cloud builder, community founder' },
      { kind: 'cmd', text: 'hostnamectl --static' },
      { kind: 'out', text: 'homelab  (Lenovo ThinkPad X250 · Ubuntu Server)' },
      { kind: 'cmd', text: 'systemctl is-active cockpit.socket' },
      { kind: 'out', text: 'active' },
      { kind: 'cmd', text: 'pm2 status' },
      { kind: 'out', text: 'process manager online · services supervised' },
      { kind: 'cmd', text: 'cloudflared tunnel list' },
      { kind: 'out', text: 'zero-trust ssh tunnel · healthy · 0 open inbound ports' },
      { kind: 'muted', text: 'type `help` for more commands' },
    ],
    commands: [
      {
        name: 'help',
        description: 'List available commands',
        output: [
          { kind: 'out', text: 'whoami    who is behind this site' },
          { kind: 'out', text: 'stack     homelab hardware & software' },
          { kind: 'out', text: 'network   how the server is exposed' },
          { kind: 'out', text: 'devices   workstations & mobile lab' },
          { kind: 'out', text: 'uptime    server availability' },
          { kind: 'out', text: 'contact   how to reach me' },
          { kind: 'out', text: 'clear     clear the terminal' },
        ],
      },
      {
        name: 'whoami',
        description: 'Who is behind this site',
        output: [
          { kind: 'accent', text: 'H. Can Umutlu' },
          { kind: 'out', text: 'Information Systems & Technologies · Sivas Cumhuriyet University' },
          { kind: 'out', text: 'International Entrepreneurship · Istanbul University' },
          { kind: 'out', text: 'Microsoft AI Intern 2026 · HCCDA–AI · Founder, HSD Sivas Cumhuriyet' },
        ],
      },
      {
        name: 'stack',
        description: 'Homelab hardware & software',
        output: [
          { kind: 'out', text: 'host     Lenovo ThinkPad X250 (repurposed)' },
          { kind: 'out', text: 'os       Ubuntu Server' },
          { kind: 'out', text: 'manage   Cockpit web console' },
          { kind: 'out', text: 'procs    PM2' },
        ],
      },
      {
        name: 'network',
        description: 'How the server is exposed',
        output: [
          { kind: 'out', text: 'edge     Cloudflare Zero Trust · SSH tunnels' },
          { kind: 'out', text: 'inbound  none · no port forwarding' },
          { kind: 'out', text: 'lan      segmented · TP-Link TL-SG108E managed switch' },
        ],
      },
      {
        name: 'devices',
        description: 'Workstations & mobile lab',
        output: [
          { kind: 'out', text: 'desk     Lenovo ThinkPad X1 Carbon · Windows 10/11' },
          { kind: 'out', text: 'mobile   Android · Termux + code-server' },
        ],
      },
      {
        name: 'uptime',
        description: 'Server availability',
        output: [{ kind: 'out', text: 'always on · 24/7 home server' }],
      },
      {
        name: 'contact',
        description: 'How to reach me',
        output: [
          { kind: 'out', text: 'mail     himmetcanumutlu.business@gmail.com' },
          { kind: 'out', text: 'github   github.com/himmetcanumutlu' },
          { kind: 'out', text: 'linkedin linkedin.com/in/himmetcanumutlu' },
        ],
      },
    ],
  },
}
