# Tech Care · CS AI Analyst

A minimalist, Claude-inspired customer-support analyst built with **React + Vite + Tailwind CSS**, styled on the **Weaver Design System** tokens (Inter, 8px grid, noon-yellow `#FEEE00` accent on a soft `#F9F9F9` canvas).

## What it does

A four-agent pipeline runs **linearly inside one main panel**:

1. **Discovery** — a chat-messenger style input where you prompt the analyst.
2. **Agent thinking** — agents narrate their reasoning with inline **Approve / Cancel**.
3. **Analytics checkpoint** — charts and signals shown inline.
4. **Report** — the final written brief.

Steps 2–4 are **rich, click-to-edit outputs** (edit the generated text inline before moving on). The sidebar holds only the **Tech Care** squad identity and **historical report logs**; opening a log shows the full report with a follow-up question box at the end.

### Design rules

- Borderless, whitespace-driven layout — no heavy boxes or shadows.
- No green "success" states. Completed/active steps use a thin line accent and a microscopic noon-yellow status dot.

## Develop

```bash
npm install
npm run dev      # http://localhost:4173
```

## Build

```bash
npm run build
npm run preview
```

## Structure

```
src/
  App.jsx                 # flow orchestration + routing between steps/history
  data/analyst.js         # agents, analytics, and report content
  components/
    Sidebar.jsx           # squad identity + history logs only
    StepRail.jsx          # linear step indicator (noon-dot status)
    Step1Discovery.jsx    # chat-messenger input
    Step2Thinking.jsx     # agent thought stream + inline approve/cancel
    Step3Analytics.jsx    # inline analytics checkpoint
    Step4Report.jsx       # editable report + ask box
    Charts.jsx            # minimal bar/donut/line charts
    Editable.jsx          # inline contentEditable wrapper
```
