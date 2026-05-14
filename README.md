# Resilix — Organizational Resilience & Value-System Alignment

> Enterprise Preview | Powered by SDTEST® | Spiral Dynamics Intelligence

🌐 Language
🇬🇧 [English](#english) • 🇷🇺 [Русский](#russian)

<a id="english"></a>
## 🎮 Overview

Resilix is a 30-second organizational resilience scanner for enterprises (4,000+ employees, multi-location).

**Pain**: "Everything depends on 1–2 people. If they leave, business collapses."

**What Resilix does**: In about thirty seconds it surfaces **value-system misalignment**, **key-person dependency risk**, and a **concrete stabilization path** (e.g., 90-day plan) so leaders can act before disruption compounds.

Open the **[Live Demo](https://sdtest-me.github.io/resilix/)** for the interactive preview.

## 🧭 Core Concepts

Resilix maps organizational units to Spiral Dynamics stages (vMEMEs), ordered left to right. Stage distribution is shown as compact bars for an at-a-glance executive read.

| Stage | Color | Signal | Risk |
|-------|-------|--------|------|
| Beige | 🟤 | Survival, reactive | Operational fragility |
| Purple | 🟣 | Tribe, ritual, belonging | Insider–outsider friction |
| Red | 🔴 | Power, control | Key-person dependency |
| Blue | 🔵 | Rules, discipline | Strategy–execution gap |
| Orange | 🟠 | KPIs, results | Innovation stagnation |
| Green | 🟢 | Consensus, culture | Decision paralysis |
| Yellow | 🟡 | Systems, adaptivity | Over-engineering |
| Turquoise | 💎 | Holistic, global weave | Idealism–execution gap |

## 📊 Example Output

\`\`\`json
{
  "dependencyScore": 68,
  "verdict": "Execution friction zone",
  "riskScenario": "If critical director leaves: 72% probability of disruption within 90 days",
  "roi": "Preventing ONE $100M disruption = 80x annual investment"
}
\`\`\`

## 🏗️ Architecture

- **Static demo:** Single-page HTML with embedded styles and client-side language/theme toggles.
- **GitHub Pages:** \`docs/index.html\` is the primary deploy target for the public preview.
- **Configuration:** Client-specific copy and metrics live in a small \`CLIENT\` block inside the page script.
- **Data stance:** Demo illustrates public-signal narratives; internal calibration is the path to higher precision.

## 📁 Repository Structure

| Path | Role |
|------|------|
| \`docs/index.html\` | GitHub Pages demo (EN/RU, Light/Dark) |
| \`data/demo/\` | Public demo datasets and profiles |
| \`scripts/fetch_esg.py\` | Public data collector |
| \`.github/workflows/ci.yml\` | README & deploy checks |

## 🚀 Quick Start

\`\`\`bash
git clone https://github.com/sdtest-me/resilix.git && cd resilix
open docs/index.html
\`\`\`

## 📔 Contact

- Sponsor Lab: [sdtest.me/price#tariff-10](https://sdtest.me/price#tariff-10)
- Feedback: [info@sdtest.me](mailto:info@sdtest.me)
- GitHub: [sdtest-me/resilix](https://github.com/sdtest-me/resilix)

*Resilix is part of SDTEST® – Spiral Dynamics intelligence for enterprise decision-making.*

<a id="russian"></a>
## Русский

> Полный перевод README на русский язык будет добавлен после валидации английской версии и финализации терминологии. Пока используйте раздел English и живой демо с переключателем EN/RU в интерфейсе.
