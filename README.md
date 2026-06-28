# 🛡️ RedMind AI

### Autonomous Multi-Agent Cybersecurity Intelligence Platform

<p align="center">

![RedMind Banner](./assets/banner.png)

**AI-Powered External Attack Surface Management (EASM)**

*Recon • Exposure • Attack Paths • Risk • Remediation • Executive Reports*

</p>

---

# 🚀 Overview

RedMind AI is an autonomous cybersecurity intelligence platform powered by a coordinated network of AI agents.

Instead of simply scanning websites, RedMind behaves like an AI security analyst that gathers evidence, reasons about an organization's attack surface, models possible attack paths, prioritizes business risk, generates remediation strategies, and produces executive-ready security reports.

Every stage is performed by a dedicated AI agent inside a unified intelligence pipeline.

The system transforms raw internet-facing evidence into structured, explainable cybersecurity intelligence.

---

# ✨ Features

## 🤖 7-Agent AI Intelligence Pipeline

* Evidence Collection Agent
* Recon Intelligence Agent
* Exposure Analysis Agent
* Attack Path Analysis Agent
* Risk Assessment Agent
* Remediation Planning Agent
* Report Generation Agent

Each agent owns only its own PipelineState section, creating a modular, scalable and explainable architecture.

---

## 🌐 Evidence Collection

Automatically discovers

* Website metadata
* Technologies
* Cloud providers
* CDN providers
* SSL certificates
* HTTP headers
* DNS information
* GitHub repositories
* Security headers
* External services
* Public assets
* Infrastructure
* Organization profile

---

## 🧠 AI Reasoning

RedMind does not stop at data collection.

The platform performs multi-stage AI reasoning to understand

* Technology stack
* Asset relationships
* Internet exposure
* Trust boundaries
* Security posture
* Cloud architecture
* Attack surface

---

## ⚔ Attack Path Simulation

Automatically models

* Initial access
* Lateral movement
* Privilege escalation
* Asset relationships
* Critical paths
* Evidence references

---

## 🚨 Risk Intelligence

Generates

* Risk scoring
* MITRE ATT&CK mapping
* CWE mapping
* CVSS estimation
* Business impact
* Likelihood
* Asset prioritization

---

## 🛠 Remediation Planning

Produces actionable recommendations including

* Quick wins
* Critical actions
* Long-term roadmap
* Implementation phases
* Rollback plans
* Validation steps
* Monitoring strategy

---

## 📄 Executive Reporting

Automatically generates

* Executive Report
* Technical Report
* Developer Report
* SOC Report
* Management Report
* Compliance Report

Export support

* PDF
* HTML
* DOCX
* JSON

---

# 🏗 Architecture

```
                    ┌──────────────────────┐
                    │     User enters URL  │
                    └──────────┬───────────┘
                               │
                               ▼
                 Agent 0 - Evidence Collection
                               │
                               ▼
                Agent 1 - Recon Intelligence
                               │
                               ▼
                Agent 2 - Exposure Analysis
                               │
                               ▼
             Agent 3 - Attack Path Analysis
                               │
                               ▼
                Agent 4 - Risk Assessment
                               │
                               ▼
            Agent 5 - Remediation Planning
                               │
                               ▼
              Agent 6 - Report Generation
                               │
                               ▼
                 Interactive Security Dashboard
```

---

# 🧩 PipelineState Architecture

Every AI agent only owns one section.

```
PipelineState

├── scan_metadata
├── evidence
├── recon
├── exposure
├── attack_paths
├── risk
├── remediation
└── report
```

No agent modifies another agent's work.

This makes the pipeline immutable, traceable and highly scalable.

---

# 🖥 Frontend

Enterprise dashboard built using

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* React Flow
* Recharts
* TanStack Query
* Zustand
* Lucide Icons

Features

* Live pipeline progress
* Streaming activity logs
* Interactive attack graph
* Security score dashboard
* Risk charts
* Asset inventory
* Executive reports
* Dark mode
* Responsive UI
* Progressive rendering

---

# ⚙ Backend

Python backend powered by

* FastAPI
* Pydantic v2
* Featherless AI
* Firecrawl
* OpenAI-compatible APIs
* Async execution
* Structured Outputs
* JSON validation

---

# 🧠 AI Pipeline

## Agent 0

Evidence Collection

Responsible for

* Web crawling
* Technology detection
* Metadata extraction
* Asset discovery

---

## Agent 1

Recon Intelligence

Produces

* Organization profile
* Technology inventory
* Infrastructure summary
* Cloud summary

---

## Agent 2

Exposure Analysis

Produces

* Internet-facing assets
* Authentication surfaces
* Public APIs
* Dependencies
* Exposure maps

---

## Agent 3

Attack Path Analysis

Produces

* Attack chains
* Entry points
* Lateral movement
* Critical assets

---

## Agent 4

Risk Assessment

Produces

* Risk scores
* MITRE mapping
* CWE mapping
* Business impact

---

## Agent 5

Remediation Planning

Produces

* Implementation roadmap
* Priority actions
* Validation steps
* Rollback plans

---

## Agent 6

Report Generation

Produces

* Executive report
* Technical report
* SOC report
* Compliance report

---

# 📊 Dashboard

The dashboard updates in real time.

```
✔ Evidence Collection

✔ Recon Intelligence

✔ Exposure Analysis

✔ Attack Path Analysis

✔ Risk Assessment

✔ Remediation Planning

✔ Report Generation
```

---

# 🔍 Analysis Workflow

```
Enter URL

↓

Evidence Collection

↓

Recon Intelligence

↓

Exposure Analysis

↓

Attack Path Analysis

↓

Risk Assessment

↓

Remediation Planning

↓

Executive Report

↓

Interactive Dashboard
```

---

# 🛠 Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* React Flow
* Recharts
* TanStack Query
* Zustand

### Backend

* FastAPI
* Python
* Pydantic v2
* OpenAI SDK
* Featherless AI
* Firecrawl
* AsyncIO

### AI

* Multi-Agent Architecture
* Structured Outputs
* Prompt Chaining
* JSON Validation
* PipelineState
* AI Reasoning

---

# 📈 Performance Optimizations

* Context compression
* Structured JSON outputs
* Retry-on-validation
* Progressive rendering
* Immutable pipeline
* Shared PipelineState
* Token usage tracking
* Execution metrics
* Cost estimation
* Latency monitoring

---

# 🔒 Security

* Schema validation
* Strict JSON enforcement
* Evidence traceability
* Immutable agent outputs
* Prompt isolation
* Type-safe models
* Retry protection
* Input validation

---

# 📸 Screenshots

```
docs/images/

landing.png

dashboard.png

attack-graph.png

risk-dashboard.png

report.png
```

---

# 🚀 Getting Started

```bash
git clone https://github.com/yourusername/redmind-ai

cd redmind-ai

pip install -r requirements.txt

npm install

cp .env.example .env

uvicorn src.redmind.api.main:app --reload

npm run dev
```

Open

```
http://localhost:3000
```

Enter a target URL and watch the AI pipeline execute in real time.

---

# 📂 Project Structure

```
src/

agents/
├── evidence_collection
├── recon
├── exposure
├── attack_path
├── risk
├── remediation
└── report

models/
api/
frontend/
prompts/
legacy/
```

---

# 🎯 Roadmap

* Authentication
* Team collaboration
* Continuous monitoring
* Scheduled scans
* CVE enrichment
* Threat intelligence feeds
* SIEM integration
* Jira integration
* Slack notifications
* Cloud attack graph
* Multi-tenant organizations
* API keys
* RBAC
* Container deployment
* Kubernetes support

---

# 🤝 Contributing

Contributions are welcome.

Fork the repository, create a feature branch, submit a pull request, and help build the future of AI-powered cybersecurity.

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**Sayak Mondal**

AI Engineer • Multi-Agent Systems • Cybersecurity • Agentic AI • RAG • Full Stack AI

---

<p align="center">

**RedMind AI**

*Transforming Raw Internet Data into Actionable Cyber Intelligence.*

⭐ If you like this project, please consider starring the repository.

</p>
