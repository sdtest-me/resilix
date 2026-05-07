# Resilix — Organizational Resilience & Value-System Alignment

> **Enterprise Preview** | Powered by SDTEST® | Spiral Dynamics Intelligence

[🌐 Live Demo](https://sdtest-me.github.io/resilix/)

---

## 🎯 30-Second Executive Scan

**For**: COO, HR Director, CEO of enterprises (4,000+ employees, multi-location)  
**Pain**: "Everything depends on 1-2 people. If they leave, business collapses."  
**Resilix solves**: In 30 seconds shows **value-system misalignment** + **key-person dependency risk** + **90-day stabilization plan**.

```json
{
  "dependencyScore": 68,
  "verdict": "Execution friction zone",
  "riskScenario": "If critical director leaves: 72% probability of disruption within 90 days",
  "roi": "Preventing ONE $100M disruption = 80x annual investment",
  "cta": "Internal data calibration → 94% accuracy → Sponsor Lab"
}

---

## 🧭 Spiral Dynamics Integration

Resilix maps organizational units to Spiral Dynamics stages (vMEME), ordered left→right:

| Stage | Color | Signal | Risk if Misaligned |
|-------|-------|--------|--------------------|
| Beige | 🟤 | Survival, reactive | Operational fragility |
| Purple | 🟣 | Tribal belonging, rituals, safety through tradition | Groupthink, exclusion of outsiders, decision by superstition |
| Red | 🔴 | Power, control | Key-person dependency |
| Blue | 🔵 | Rules, discipline | Strategy-execution gap |
| Orange | 🟠 | KPIs, results | Innovation stagnation |
| Green | 🟢 | Consensus, culture | Decision paralysis |
| Yellow | 🟡 | Systems, adaptivity | Over-engineering |
| Turquoise | 💎 | Global perspective, holistic integration, systems-of-systems | Analysis paralysis at global scale, loss of local agency, over-abstraction | 

**Visual output**: Stage distribution bars (24px height, inline labels) for instant executive scan.

---

## 🏗️ Architecture

resilix/
├── docs/index.html # GitHub Pages demo (EN/RU, Light/Dark)
├── prompts/jtbd/ # JTBD prompt templates
├── data/demo/ # Public datasets (ESG, job boards)
├── data/sources/ # Local PDFs (*.gitignored)
├── output/ # Generated JSON outputs
└── src/ # Future: core engine (JS/TS)


**Key design principles**:
- ✅ **Product-centric naming**: `resilix-org-resilience.html` (not client-locked)
- ✅ **Client config in one place**: `const CLIENT = { name, risk, score... }`
- ✅ **Conversion bridge built-in**: "Public data → 94% with internal data → Sponsor Lab"
- ✅ **Zero external dependencies**: Single HTML file, works offline

--.

## 🚀 Quick Start (Automation-First)

```bash
# 1. Clone & init (if starting fresh)
git clone https://github.com/sdtest-me/resilix.git ~/resilix && cd ~/resilix

# 2. Run demo locally
open docs/index.html

# 3. Customize for new client:
#    Edit only 5 lines in docs/index.html (inside <script>):

---

## 💰 Business Model: JTBD Satellite ₒ Sponsor Lab

```
Public Demo (resilix.sdtest.me)
↓
30-sec scan: pain + ROI + stage map
↓
"Public data → 94% with internal data"
↓
[🔒 Request Custom Risk Report & Calibration Session]
↓
Sponsor Lab (€10k/mo): Internal calibration • Executive workshop • Quarterly review
```

**Why this converts**:
- €10k/mo = ~0.003% of enterprise revenue → signal of quality, not cost
- ROI framed *before* price: "80x return on preventing ONE disruption"
- Language of outcome: "Get CLIENT-Specific Risk Report" (not "Access")

---

## 🤝 Contributing / Internal Use

This repo is maintained by Valerii Kosenko for SDTEST® product development.

**Automation principles**:
- Commands are copy-paste ready (zsh/macOS compatible)
- No manual file editing — all updates via scripted commands
- Local Ollama (`qwen2.5-coder:1.5b`) for draft generation, Codex for final PRs

**To add a new satellite**:
1. Copy `docs/index.html` → `docs/resilix-[vertical].html`
2. Update `const CLIENT` + content strings in `<script>`
3. Commit & push → GitHub Pages auto-deploys

---

## 📔 Contact

- Product feedback: [info@sdtest.me](mailto:valerii@sdtest.me)
- GitHub: [sdtest-me/resilix](https://github.com/sdtest-me/resilix)

---

*Resilix is part of SDTEST® – Spiral Dynamics intelligence for enterprise decision-making.  
Built with automation-first principles. No fluff. No copy-paste. Just conversion.*
