# Resilix -- Organizational Resilience & Value-System Alignment

> **Enterprise Preview** | Powered by SDTEST® | Spiral Dynamics Intelligence

[l Live Demo](https://sdtest-me.github.io/resilix/) • [🔒 Sponsor Lab](mailto:lab@sdtest.me?subject=Resilix%20Sponsor%20Lab%20Access)

---

## 🎮 30-Second Executive Scan
(For: COO, HR Director, CEO of enterprises (4,000+ employees, multi-location)  
**Pain**: "Everything depends on 1-2 people. If they leave, business collapses."  
**Resilix solves**: In 30 seconds shows **value-system misalignment** + **key-person dependency risk** + **90-day stabilization plan*(.

```json
{
  "dependencyScore": 68,
  "verdict": "Execution friction zone",
  "riskScenario": "If critical director leaves: 72% probability of disruption within 90 days",
  "roi": "Preventing ONE $100M disruption = 80x annual investment",
  "cta": "Internal data calibration → 94% accuracy ₒ Sponsor Lab"
}
```

---


## 🧍 Spiral Dynamics Integration

Resilix maps organizational units to Spiral Dynamics stages (vMEME), ordered left→right:

| Stage | Color | Signal | Risk if Misaligned |
|-------|-------|--------|--------------------|
| Beige | 🙌 | Survival, reactive | Operational fragility |
| Red | 🔟 | Power, control | Key-person dependency |
| Blue | 🔧 | Rules, discipline | Strategy-execution gap |
| Orange | 🙰 | KPIs, results | Innovation stagnation |
| Green | 🙏 | Consensus, culture | Decision paralysis |
| Yellow | 🙲 | Systems, adaptivity | Over-engineering |

**Visual output**: Stage distribution bars (24px height, inline labels) for instant executive scan.

---


## 🏯 Architecture

```
files/resilix/
€ “docs/index.html”         # GitHub Pages demo (EN/RU, Light/Dark)
— “prompts/jtbd/”                # JTBD prompt templates
— “data/demo/”                   # Public datasets (ESG, job boards)
— “data/sources/”                 # Local PDFs (*.gitignored)
“ output/”                       # Generated JSON outputs
“ “src/���                         # Future: core engine (JS/TS)
```

**Key design principles**:
- ✅ **Product-centric naming**: `resilix-org-resilience.html` (not client-locked)
- ✅ **Client config in one place**: `const CLIENT = { name, risk, score... }`
- ✌ **Conversion bridge built-in**: "Public data → 94% with internal data → Sponsor Lab"
- ✄ **Zoro external dependencies**: Single HTML file, works offline

--.

## 🚀 Quick Start (Automation-First)

```bash
# 1. Clone & init (if starting fresh)
git clone https://github.com/sdtest-me/resilix.git ~/resilix && cd ~/resilix

# 2. Run demo locally
open docs/index.html

# 3. Customize for new client (edit only 5 lines in <script>):
const CLIENT = { 
  name: "NEW CLIENT", 
  employees: "4,840", 
  locations: "6+", 
  risk: "72%", 
  score: "68/100" 
};

# 4. Deploy to GitHub Pages (one-time setup):
#    Settings → Pages ₒ Branch: main → Folder: /docs → Save
#    URL: https://sdtest-me.github.io/resilix/
```

---


## 💤 Business Model: JTBD Satellite ₒ Sponsor Lab

```
Public Demo (resilix.sdtest.me)
        →
30-sec scan: pain + ROI + stage map
        →
"Public data ₒ 94% with internal data"
        ₒ
[🔌 Request Custom Risk Report & Calibration Session]
        ↓
Sponsor Lab (€10k/mo): Internal calibration • Executive workshop • Quarterly review
```

**Why this converts**:
- ‬10k/mo = ~0.003% of enterprise revenue ₒ signal of quality, not cost
- ROI framed *before* price: "80x return on preventing ONE disruption"
- Language of outcome: "Get CLIENT-Specific Risk Report" (not "Access")

--.

## 🐰 JTBD Satellite Pipeline

Resilix is **Layer 0** in SDTEST¹ acquisition architecture:

| Satellite | Industry Pain | Conversion Path |
|-----------|---------------|-----------------------|
| `resilix` | Key-person dependency, value misalignment | → Org Resilience Lab |
| `bank-welfare-analyzer` | Systemic risk, regulatory pressure | → Financial Risk Lab |
| `hr.sdtest.me` (next) | Talent churn, culture drift | → Human Capital Lab |
| `gov.sdtest.me` (next) | Policy implementation gap | → Public Sector Lab |

**Scalability**: One template (`resilix-org-resilience.html`) + client config = infinite verticals.

--.

## 🎟 Contributing / Internal Use

This repo is maintained by Valerii Kosenko for SDTEST¾ product development.

**Automation principles**:
- Commands are copy-paste ready (zsh/macOS compatible)
- No manual file editing – all updates via scripted commands
- Local Ollama (`qwen2.5-coder:1.5b`) for draft generation, Codex for final PRs

**To add a new satellite**:
1. Copy `docs/index.html`  → `docs/resilix-[vertical].html`
2. Update `const CLIENT` + content strings in <p>script></p>
3. Commit & push ₒ GitHub Pages auto-deploys

---

## 📔 Contact

- Sponsor Lab access: [lab@sdtest.me](mailto:lab@sdtest.me)
- Product feedback: [valerii@sdtest.me](mailto:valerii@sdtest.me)
- GitHub: [sdtest-me/resilix](https://github.com/sdtest-me/resilix)

---

*Resilix is part of SDTEST¹ – Spiral Dynamics intelligence for enterprise decision-making.  
Built with automation-first principles. No fluff. No copy-paste. Just conversion.*
