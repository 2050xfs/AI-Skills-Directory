# Skill Smithy (AI Skills Directory) — Full Site Description

## Overview
Skill Smithy is a single-page React application (Vite + TypeScript) that presents a futuristic, enterprise-grade registry for AI “skills” (agent capabilities). It blends a marketplace-style catalog with a governance/operations console and AI-generated analysis content. The site is themed as an internal enterprise control plane with a dark, neon-slate aesthetic and animated UI cues.

The app is built around three core routes:
- **Registry (Marketplace)**: searchable skill catalog with AI-assisted intent matching.
- **Analysis (Blog Post)**: per-skill, AI-generated long-form analysis with imagery and metadata.
- **Cognition Stream (Admin Console)**: a governance dashboard featuring organization structure, activity logs, and a manual security audit tool.

## Technology Stack
- **React 19** for UI rendering (`index.tsx`, `App.tsx`).
- **React Router (HashRouter)** for client-side routing (`App.tsx`).
- **Tailwind CSS via CDN** for styling and theme tokens (`index.html`).
- **Lucide icons** for iconography throughout UI.
- **Recharts** for analytics visualization in admin console.
- **ReactMarkdown** for rendering AI-generated markdown content.
- **Google Gemini SDK (`@google/genai`)** for AI-backed features (intent matching, content generation, audits, media generation).

## Application Layout & Navigation
### Global Layout
- **Two-column layout** on desktop:
  - Left sidebar (fixed, sticky) with app branding, navigation, and system health status.
  - Right main content pane for page routes.
- **Mobile navigation**: a compact header with a collapsible menu.
- **Base background**: dark slate (`#020617`) with neon blue/violet highlights and subtle animations.

### Sidebar
- **Branding**: “Skill Smithy” with a Zap icon and a product label: “ENT-REGISTRY v3.1.”
- **Navigation**:
  - “Registry” (route `/`).
  - “Cognition Stream” (route `/admin`).
- **System Health Panel**: shows `SENTINEL` (ONLINE) and `WRITER-01` (ACTIVE) statuses.

### Mobile Nav
- Compact top bar for small screens with:
  - Brand name and icon.
  - Toggle menu button showing links for Registry and Cognition Stream.

## Routing Structure
The application uses a HashRouter with these routes:
- `/` — **DiscoveryEngine (Marketplace)**
- `/blog/:skillId` — **BlogPost (Analysis)**
- `/admin` — **AdminConsole (Cognition Stream)**

## Registry (Marketplace)
### Purpose
Provides a catalog of AI skills with AI-assisted search and filtering. Acts as a “skills marketplace” for enterprise use cases.

### Core Elements
1. **Header**:
   - Title: “Marketplace”.
   - Subtitle: “Discover specialized AI agents for your enterprise jobs.”
   - Status pill: “Curator Agent Active.”

2. **Search Bar**:
   - Placeholder prompts user to describe intent (e.g., “Help me analyze SEC filings”).
   - Uses AI to match skill intent (Gemini) and falls back to text search.
   - Shows spinner while querying.

3. **Category Tabs**:
   - All Skills
   - Finance
   - Design
   - Productivity
   
   Tabs control UI filtering by `skill.category` (case-insensitive). Some skills (Utilities, Legacy) are present but not displayed by default unless “All Skills” is selected.

4. **Skill Cards**:
   - Each card shows:
     - Skill initials avatar
     - Verification badge (Verified or Quarantined)
     - Name & short description
     - Two primary outcomes
     - Compatibility type (Local / Hosted / Edge)
     - Provider
     - “Analysis” link to the blog view
   - Quarantined skills appear muted, with grayscale and reduced opacity.

### Search Logic
- If the search box is empty: show all skills.
- Otherwise:
  1. Calls `matchSkillsWithIntent` to send the query + skill summary to Gemini.
  2. Parses returned JSON array of skill names.
  3. Filters local skills to matched names.
  4. Adds a fallback fuzzy match if AI misses some items.
  5. If no AI results, falls back to simple local text search.

## Analysis (Blog Post)
### Purpose
Generates a full SEO-styled “analysis” article for a skill on demand, including AI-generated imagery, metadata, and content.

### Flow
1. User selects “Analysis” on a skill card.
2. A loading sequence simulates “Agent” activity.
3. The app requests:
   - **Blog post content** from Gemini 3 Pro (structured JSON with title, content, SEO data).
   - **Hero image** from Gemini 2.5 Flash Image (“Nano Banana”).
4. The page renders once both are ready.

### UI Structure
- **Header**: back link to Registry.
- **Main Article** (left column):
  - Category badge and a primary keyword.
  - Title and metadata: author agent, generated date.
  - Hero image (with a “Rendered by Nano Banana” label).
  - Markdown-rendered content with enhanced typography.
- **Sidebar** (right column):
  - Skill metadata: provider, risk score, SEO keywords.
  - Jobs-to-be-done outcomes list.
  - “Share Analysis” CTA button (visual only).

### Loading & Error States
- **Loading**: animated CPU icon, agent activity logs, and progress bar animation.
- **Error**: shows “Autonomous generation failed. Agents are offline.”
- **Missing skill**: “Skill not found in registry.”

## Cognition Stream (Admin Console)
### Purpose
A governance and operations dashboard representing the internal AI management structure and live system logs.

### Tabs
1. **Neural Architecture**
   - Visual org chart of divisions and departments.
   - Each agent card can be clicked to open an **Inspector** panel.
   - Inspector shows:
     - Agent name + role
     - Core purpose
     - Status badge (active, processing, etc.)
     - Daily routines and decision rights

2. **Live Logs**
   - **Bar chart**: 24-hour activity volume by agent (Sentinel, Janitor, Curator, Herald).
   - **Quick stats**: Auto-Fix PRs Open, Skills Quarantined.
   - **Event log table** with timestamps, agent IDs, event types, observations, and actions.

3. **Manual Audit**
   - Textarea for pasting source code.
   - “Run Sentinel Scan” triggers Gemini-based code audit.
   - Audit report shows:
     - Risk score (progress bar)
     - Status (APPROVED / FLAGGED / QUARANTINED)
     - Findings list

### Notable Behaviors
- Clicking an agent in the org chart updates the right-side inspector.
- Audit calls `auditCodeSnippet` and expects a JSON response.

## Data Model & Mock Content
All data is mocked and stored locally in `constants.ts`.

### Skills
Sample skill entries include:
- **SEC Analyst Pro** (Finance, Hosted)
- **Jira Sprint Groomer** (Productivity, Edge)
- **Figma Design Auditor** (Design, Local)
- **Crypto Price Fetcher v2** (Utilities, Quarantined)
- **Legacy API Connector** (Legacy)

Each skill includes:
- `id`, `name`, `description`
- `provider`, `category`, `outcomes`
- `riskScore`, `compatibility`, `status`
- `installCount`, `lastAudited`, `tags`

### Logs
Mock activity logs show events like:
- Permission mismatches
- API drift
- Outcome mapping
- Policy updates

### Org Chart
Organizational hierarchy contains divisions like:
- Executive Control Plane
- Trust & Security Division
- Infrastructure Division
- Knowledge Division
- Narrative Division
- UX Division

Each division contains departments and agent profiles with roles, tasks, and decision rights.

## AI Integration (Gemini)
Gemini is used for:
1. **Search intent matching** (Gemini 3 Flash preview).
2. **Security audits** (Gemini 3 Pro preview).
3. **Blog post generation** (Gemini 3 Pro preview).
4. **Blog image generation** (Gemini 2.5 Flash Image, “Nano Banana”).
5. **Media lab generation** (image, edit, video, though this UI is not currently routed).

### API Key
The service expects `process.env.API_KEY`. If missing, the app throws “API Key not found in environment variables.”

## Media Lab (Unused Route)
There is a full **MediaLab** component in the codebase, but it is not wired into routing.

### Features (if added to routing)
- **Image Generation**: prompt + aspect ratio + resolution.
- **Image Editing**: upload an image + edit prompt.
- **Video Generation**: prompt + aspect ratio.
- Preview panel for image/video results.
- Download support for generated results.

## Styling & Theme
- Tailwind CSS is loaded via CDN, not locally compiled.
- Typography uses:
  - **Inter** for sans-serif
  - **JetBrains Mono** for code-like labels
- Primary palette centers on slate backgrounds with blue and violet accent glows.
- Custom scrollbar styling for dark theme.

## State Management
- Local React component state only (no external state library).
- Key states:
  - Search query, results, and loading in Registry.
  - Blog post content, loading steps, and error states.
  - Admin console tab selection, selected agent, audit input and result.

## Environment & Build
- Project uses Vite and `npm run dev` for local development.
- Dependencies are available both through package.json and as CDN imports in `index.html`.

## What the Site Represents (Narrative)
Skill Smithy presents a fictional, enterprise-grade AI registry with a strong “autonomous immune system” narrative:
- “Curator” agents manage discovery.
- “Sentinel” agents audit safety.
- “Herald” agents generate content.
- “Artist” agents generate visuals.

The UI emphasizes trust, security, and operational governance for AI skills inside an enterprise.

## Summary of User Experience
A user can:
1. Browse AI skills in a searchable, categorized grid.
2. Filter or search with AI-assisted intent matching.
3. Open a per-skill analysis page that auto-generates long-form content and imagery.
4. Inspect internal governance structures and logs in the Cognition Stream console.
5. Run manual code audits via an embedded AI audit tool.

The site is intentionally styled as a futuristic, enterprise internal control platform, combining marketing-style content with governance tooling.
