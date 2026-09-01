# OTel Visual Explainer — AGENTS.md

## Hard Constraints

- **Single self-contained HTML file** — no external dependencies, no CDN, no build system. Must work offline.
- **Vanilla JS only** — no frameworks (React, Vue, etc.). No bundler. No transpiler.
- **No external fonts** — use system font stack for offline support.
- **OTel color palette**: orange `#f5a800`, teal `#425cc7`, blue `#4285f4`. Cribl accent color in the final section only.
- **Dark theme** — consistent with existing workspace artifacts.
- **PRD is canonical** — see `PRD.md` for full spec. This file is quick-reference for agents.

## Module Layout

| Module | Depth | Description |
|--------|-------|-------------|
| Theme & Design Tokens | DATA | CSS custom properties, OTel palette, Cribl accent |
| Signal Schema Renderer | DEEP | Interactive schema for traces/metrics/logs, clickable highlight |
| Pipeline Flow Animator | DEEP | Animated OTLP pipeline flow, stage highlighting |
| Schema Inspector | MEDIUM | Hover/click field detail panel |
| Signal Tab Switcher | SHALLOW | Traces/Metrics/Logs tab navigation |
| Reveal Toggle Controller | SHALLOW | Expandable/collapsible sections |
| Semantic Conventions Reference | DATA | Static attribute reference table |
| Cribl Integration Section | MEDIUM | Where Cribl Fits — routing scenarios |

## Testing

- Pure functions from DEEP/MEDIUM modules extracted to `otel-logic.js`
- Tests in `test.js` run with Node.js (no framework, assert-based)
- Test targets: Modules 2, 3 (DEEP) + pure functions from 4, 8 (MEDIUM)

## File Structure

```
otel-visual-explainer/
├── AGENTS.md          # This file — quick reference
├── PRD.md             # Full PRD — canonical spec
├── index.html         # The artifact (single self-contained file)
├── otel-logic.js      # Extracted pure functions (testing target)
└── test.js            # Node.js tests for pure functions
```

## Content Flow (top-to-bottom)

1. Header — title, subtitle
2. What is OpenTelemetry? — "one standard, three signals"
3. The Resource Model — shared foundation
4. Signal tabs — Traces / Metrics / Logs (interactive schema)
5. Semantic Conventions — expandable reference
6. OTLP Pipeline Architecture — animated flow
7. Where Cribl Fits — routing scenarios with Cribl accent