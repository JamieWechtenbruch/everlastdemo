# DocuSync.io — AI Voice Agent for B2B Lead Qualification

An AI-powered inbound sales voice agent that qualifies B2B leads and books demo appointments, built for the Business Development voice agent competition.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DocuSync.io Platform                   │
├──────────┬──────────────┬──────────────┬────────────────┤
│ Frontend │   Backend    │ Voice Agent  │  Infrastructure │
│ Next.js  │   FastAPI    │   LiveKit    │                │
│          │              │              │                │
│ Landing  │ Analytics API│ Gemini LLM   │  PostgreSQL    │
│ Page     │ Call Logs    │ Deepgram STT │  Redis         │
│ Dashboard│ KPI Engine   │ ElevenLabs   │  Docker        │
│ LiveKit  │ Settings     │ Google Cal   │                │
│ Widget   │ LiveKit Token│ BANT Qual.   │                │
└──────────┴──────────────┴──────────────┴────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Recharts |
| Backend | FastAPI, SQLAlchemy (async), PostgreSQL 16, Redis 7 |
| Voice Agent | LiveKit Agents SDK, Gemini 2.5 Flash, Deepgram Nova-3, ElevenLabs |
| Calendar | Google Calendar API (service account) |
| Deployment | Docker Compose, Nginx |

## Voice Agent: "Anna"

Anna is an inbound B2B sales agent for DocuSync.io, a document management SaaS. When prospects call after reading a case study about contract analysis, Anna:

1. **Greets** warmly and asks what interested them about the case study
2. **Qualifies** using BANT methodology (Budget, Authority, Need, Timeline)
3. **Positions** relevant DocuSync.io features based on their pain points
4. **Books** a demo appointment via Google Calendar integration

### Qualification Criteria
- Industry & company size
- Current document management solution
- Key pain points and challenges
- Budget availability & decision timeline
- Decision-maker identification

### Lead Scoring
- **A-Lead** (7+ points): High intent, clear budget, decision-maker
- **B-Lead** (4-6 points): Moderate interest, exploring options
- **C-Lead** (0-3 points): Early stage, information gathering

## Setup

### Prerequisites
- Docker & Docker Compose
- LiveKit Cloud account
- Google Cloud service account (Calendar API)
- Deepgram API key
- ElevenLabs API key
- Google Gemini API key

### Quick Start

```bash
# Clone and configure
cp .env.example .env
# Edit .env with your API keys

# Start all services
docker compose up -d

# Verify
docker compose ps
curl http://localhost:8003/health
```

### Environment Variables

See `.env.example` for all required configuration.

## Project Structure

```
docusync-agent/
├── frontend/           # Next.js dashboard & landing page
│   ├── src/app/        # Pages (landing, dashboard, calls, leads, settings)
│   └── src/components/ # Reusable UI components
├── backend/            # FastAPI REST API
│   └── src/
│       ├── api/        # Route handlers
│       ├── database/   # SQLAlchemy models & connection
│       └── core/       # Configuration
├── voice_agent/        # LiveKit voice agent
│   └── agent.py        # Agent logic, tools, prompts
├── docker-compose.yml  # Full stack orchestration
├── PROMPTS.md          # Conversation logic documentation
└── README.md           # This file
```

## Design Decisions

1. **Gemini 2.5 Flash for LLM**: Sub-second latency with strong German language support, cost-effective for voice interactions
2. **BANT Qualification**: Industry-standard B2B qualification framework, naturally fits conversational flow
3. **Data Channel for Email**: LiveKit data channel enables browser-agent coordination without additional WebSocket infrastructure
4. **Deterministic Lead Scoring**: Rule-based scoring ensures consistent, explainable lead grades
5. **Service Account for Calendar**: No OAuth flow needed — agent books directly, simplifying the demo experience
