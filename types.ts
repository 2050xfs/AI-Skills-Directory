export interface Skill {
  id: string;
  name: string;
  description: string;
  provider: 'Notion' | 'Figma' | 'Atlassian' | 'Slack' | 'Internal' | 'Community';
  category: string;
  outcomes: string[];
  riskScore: number;
  compatibility: 'Local' | 'Hosted' | 'Edge';
  status: 'Active' | 'Quarantined' | 'Flagged' | 'Review';
  installCount: number;
  lastAudited: string;
  tags: string[];
}

export interface BlogPost {
  title: string;
  content: string; // Markdown
  seoDescription: string;
  keywords: string[];
  generatedImageUrl?: string;
  generatedDate: string;
  authorAgent: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agentId: string; // Flexible to accommodate all new agents
  eventType: 'PERMISSION_MISMATCH' | 'API_DRIFT' | 'OUTCOME_MAPPING' | 'SECURITY_SCAN' | 'AUTO_FIX' | 'CONTENT_GEN' | 'ASSET_RENDER' | 'POLICY_UPDATE' | 'ECONOMIC_ADJUSTMENT';
  targetSkill?: string;
  observation: string;
  riskScore?: number;
  actionTaken: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export enum MediaType {
  IMAGE = 'IMAGE',
  EDIT = 'EDIT',
  VIDEO = 'VIDEO'
}

// Organizational Types
export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  purpose: string;
  tasks: string[];
  status: 'active' | 'idle' | 'processing' | 'learning';
  decisions: string[];
}

export interface Department {
  id: string;
  name: string;
  agents: AgentProfile[];
}

export interface Division {
  id: string;
  name: string;
  color: string;
  departments: Department[];
}
