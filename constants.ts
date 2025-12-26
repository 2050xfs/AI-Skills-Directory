import { Skill, AgentLog, Division } from './types';

export const MOCK_SKILLS: Skill[] = [
  {
    id: 's-101',
    name: 'SEC Analyst Pro',
    description: 'Automated 10-K analysis and financial anomaly detection using browsing capabilities.',
    provider: 'Internal',
    category: 'Finance',
    outcomes: ['Analyze 10-K', 'Audit risk assessment', 'Financial summarization'],
    riskScore: 12,
    compatibility: 'Hosted',
    status: 'Active',
    installCount: 1240,
    lastAudited: '2024-05-20',
    tags: ['finance', 'compliance', 'analysis']
  },
  {
    id: 's-102',
    name: 'Jira Sprint Groomer',
    description: 'Auto-organizes backlog tickets based on PR velocity and team capacity.',
    provider: 'Atlassian',
    category: 'Productivity',
    outcomes: ['Groom backlog', 'Estimate sprint velocity', 'Sync PRs to tickets'],
    riskScore: 5,
    compatibility: 'Edge',
    status: 'Active',
    installCount: 5600,
    lastAudited: '2024-05-21',
    tags: ['agile', 'project-management']
  },
  {
    id: 's-103',
    name: 'Figma Design Auditor',
    description: 'Scans Figma files for accessibility violations and design system drift.',
    provider: 'Figma',
    category: 'Design',
    outcomes: ['Audit accessibility', 'Check design system usage', 'Generate design specs'],
    riskScore: 2,
    compatibility: 'Local',
    status: 'Active',
    installCount: 890,
    lastAudited: '2024-05-19',
    tags: ['design', 'accessibility', 'ui/ux']
  },
  {
    id: 's-104',
    name: 'Crypto Price Fetcher v2',
    description: 'Real-time crypto ticker that writes to local CSV.',
    provider: 'Community',
    category: 'Utilities',
    outcomes: ['Track crypto prices', 'Export market data'],
    riskScore: 85,
    compatibility: 'Local',
    status: 'Quarantined',
    installCount: 45,
    lastAudited: '2024-05-22',
    tags: ['crypto', 'data', 'risky']
  },
  {
    id: 's-105',
    name: 'Legacy API Connector',
    description: 'Connects to old SOAP endpoints for inventory management.',
    provider: 'Internal',
    category: 'Legacy',
    outcomes: ['Sync inventory', 'Manage stock'],
    riskScore: 45,
    compatibility: 'Hosted',
    status: 'Review',
    installCount: 12,
    lastAudited: '2024-05-15',
    tags: ['legacy', 'inventory']
  }
];

export const MOCK_LOGS: AgentLog[] = [
  {
    id: 'l-001',
    timestamp: '2024-05-22T14:30:00Z',
    agentId: 'SENTINEL-01',
    eventType: 'PERMISSION_MISMATCH',
    targetSkill: 'Crypto Price Fetcher v2',
    observation: "Skill manifest declares 'offline' but script imports 'requests'. Detected undeclared network egress.",
    riskScore: 92,
    actionTaken: 'QUARANTINE_INITIATED',
    severity: 'critical'
  },
  {
    id: 'l-002',
    timestamp: '2024-05-22T10:15:00Z',
    agentId: 'JANITOR-01',
    eventType: 'API_DRIFT',
    targetSkill: 'Notion Sync v4',
    observation: 'Endpoint /v1/pages deprecated. Execution failed with 400 Bad Request.',
    riskScore: 0,
    actionTaken: 'PR_OPENED_FIX_DEPS',
    severity: 'medium'
  },
  {
    id: 'l-003',
    timestamp: '2024-05-22T09:00:00Z',
    agentId: 'CURATOR-01',
    eventType: 'OUTCOME_MAPPING',
    targetSkill: 'Slack Summarizer',
    observation: 'Mapped new skill to 4 existing Jobs-to-be-Done vectors.',
    riskScore: 0,
    actionTaken: 'INDEX_UPDATED',
    severity: 'low'
  },
  {
    id: 'l-004',
    timestamp: '2024-05-21T16:45:00Z',
    agentId: 'ARCHITECT-01',
    eventType: 'POLICY_UPDATE',
    observation: 'Detected systemic tension: high quarantine rate impacting growth.',
    riskScore: 0,
    actionTaken: 'REVIEW_THRESHOLD_ADJUSTED',
    severity: 'high'
  },
  {
    id: 'l-005',
    timestamp: '2024-05-21T15:30:00Z',
    agentId: 'ECONOMIST-01',
    eventType: 'ECONOMIC_ADJUSTMENT',
    observation: 'Token burn rate in Content Division exceeded hourly forecast.',
    riskScore: 0,
    actionTaken: 'MODEL_DOWNGRADE_FLASH',
    severity: 'medium'
  }
];

export const ORG_CHART: Division[] = [
  {
    id: 'div-exec',
    name: 'Executive Control Plane',
    color: 'amber',
    departments: [
      {
        id: 'dept-gov',
        name: 'System Governance',
        agents: [
          {
            id: 'ARCHITECT-01',
            name: 'The Architect',
            role: 'Chief Systems Governor',
            purpose: 'Constitution and rule-setting. Cannot execute code.',
            tasks: ['Review cognition summaries', 'Detect systemic tension', 'Update invariants'],
            status: 'active',
            decisions: ['Approve Agent Class', 'Modify Trust Threshold']
          }
        ]
      },
      {
        id: 'dept-econ',
        name: 'Economic Control',
        agents: [
          {
            id: 'ECONOMIST-01',
            name: 'The Economist',
            role: 'Resource Governor',
            purpose: 'Ensure sustainability without quality collapse.',
            tasks: ['Monitor token burn', 'Forecast load', 'Downgrade/Upgrade models'],
            status: 'processing',
            decisions: ['Allocate Gemini Pro', 'Budget Enforcement']
          }
        ]
      }
    ]
  },
  {
    id: 'div-trust',
    name: 'Trust & Security Division',
    color: 'red',
    departments: [
      {
        id: 'dept-code-sec',
        name: 'Code Security & Risk',
        agents: [
          {
            id: 'SENTINEL-01',
            name: 'Sentinel',
            role: 'Chief Security Auditor',
            purpose: 'Prevent unsafe code discoverability. Absolute veto power.',
            tasks: ['Static Code Analysis', 'Sandbox Observation', 'Intent Inspection'],
            status: 'active',
            decisions: ['QUARANTINE', 'FLAG', 'PASS']
          }
        ]
      },
      {
        id: 'dept-beh-sec',
        name: 'Behavioral Security',
        agents: [
          {
            id: 'WATCHTOWER-01',
            name: 'Watchtower',
            role: 'Emergent Threat Monitor',
            purpose: 'Detect slow, coordinated, or non-obvious attacks.',
            tasks: ['Cross-skill comparison', 'Drift detection'],
            status: 'idle',
            decisions: ['Escalate to Sentinel']
          }
        ]
      }
    ]
  },
  {
    id: 'div-infra',
    name: 'Infrastructure Division',
    color: 'cyan',
    departments: [
      {
        id: 'dept-health',
        name: 'Skill Health',
        agents: [
          {
            id: 'JANITOR-01',
            name: 'Janitor',
            role: 'Maintenance Lead',
            purpose: 'Prevent skill rot and API breakage.',
            tasks: ['Compatibility tests', 'API Drift Detection', 'Auto-Patching'],
            status: 'active',
            decisions: ['Patch', 'Deprecate']
          }
        ]
      },
      {
        id: 'dept-hist',
        name: 'Historical Integrity',
        agents: [
          {
            id: 'ARCHIVIST-01',
            name: 'Archivist',
            role: 'Lineage Steward',
            purpose: 'Maintain temporal clarity and version graphs.',
            tasks: ['Track versions', 'Freeze assets'],
            status: 'idle',
            decisions: ['Signal Migration']
          }
        ]
      }
    ]
  },
  {
    id: 'div-know',
    name: 'Knowledge Division',
    color: 'violet',
    departments: [
      {
        id: 'dept-map',
        name: 'Semantic Mapping',
        agents: [
          {
            id: 'CURATOR-01',
            name: 'Curator',
            role: 'Outcome Mapper',
            purpose: 'Translate capability into human intent.',
            tasks: ['Extract JTBD', 'Re-rank skills', 'Update Taxonomy'],
            status: 'processing',
            decisions: ['Index Update']
          }
        ]
      },
      {
        id: 'dept-lang',
        name: 'Language Intelligence',
        agents: [
          {
            id: 'LEX-01',
            name: 'Lexicographer',
            role: 'Drift Specialist',
            purpose: 'Keep search aligned with human speech patterns.',
            tasks: ['Track phrasing changes', 'Expand synonyms'],
            status: 'idle',
            decisions: ['Update Synonym Map']
          }
        ]
      }
    ]
  },
  {
    id: 'div-growth',
    name: 'Narrative Division',
    color: 'pink',
    departments: [
      {
        id: 'dept-content',
        name: 'Content Production',
        agents: [
          {
            id: 'HERALD-01',
            name: 'Herald',
            role: 'Chief Narrative Agent',
            purpose: 'Convert trust and capability into visibility (SEO).',
            tasks: ['Keyword Research', 'Blog Generation', 'Schema Updates'],
            status: 'active',
            decisions: ['Publish Article']
          }
        ]
      },
      {
        id: 'dept-visual',
        name: 'Visual Systems',
        agents: [
          {
            id: 'ARTIST-01',
            name: 'Visual Synthesist',
            role: 'Design Agent',
            purpose: 'Ensure visuals reinforce trust.',
            tasks: ['Generate Hero Images', 'Maintain Icon Systems'],
            status: 'active',
            decisions: ['Render Asset']
          }
        ]
      }
    ]
  },
  {
    id: 'div-ux',
    name: 'UX Division',
    color: 'emerald',
    departments: [
      {
        id: 'dept-trans',
        name: 'Trust Translation',
        agents: [
          {
            id: 'INTERPRETER-01',
            name: 'Interpreter',
            role: 'Translator',
            purpose: 'Explain safety without jargon.',
            tasks: ['Generate Explanations', 'Persona adaptation'],
            status: 'idle',
            decisions: ['Update UI Text']
          }
        ]
      },
      {
        id: 'dept-flow',
        name: 'Flow Optimization',
        agents: [
          {
            id: 'GUIDE-01',
            name: 'Guide',
            role: 'Friction Reducer',
            purpose: 'Shorten path from intent to action.',
            tasks: ['Test onboarding', 'Optimize Copy'],
            status: 'idle',
            decisions: ['Modify Flow']
          }
        ]
      }
    ]
  }
];
