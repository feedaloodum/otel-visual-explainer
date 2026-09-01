# OTel Visual Explainer — PRD

## Problem Statement

Cribl SEs need to explain OpenTelemetry to customers and prospects — what it is, how its schema works across all three signals (traces, metrics, logs), how data flows through the OTLP pipeline, and where Cribl intercepts and adds value. There is no single interactive, shareable artifact that teaches OTel schema and pipeline architecture with a Cribl lens. SEs resort to whiteboard sessions or ad-hoc slides that are inconsistent, not reusable, and don't convey the "one standard, three signals" story effectively.

## Solution

A single self-contained HTML file (no external dependencies, no build system) that serves as both a standalone reference page and a live walkthrough tool. The page uses the OpenTelemetry official color palette (orange/teal/blue) with a Cribl brand accent in the final section. It features full interactive exploration: animated pipeline flow, clickable signal filters, and a live schema inspector with hover field details.

The artifact teaches OTel clean first — all three signal schemas, the shared Resource model, semantic conventions, and the OTLP pipeline architecture — then lands "Where Cribl Fits" as a dedicated final section showing how Cribl Stream/Edge intercepts OTLP, transforms signals, and routes to multiple backends.

## User Stories

1. As a Cribl SE, I want to open a single HTML page that explains OpenTelemetry from scratch, so that I can reference it during customer prep without assembling slides.
2. As a Cribl SE, I want to switch between Traces, Metrics, and Logs views with tabs, so that I can focus on the signal relevant to the customer conversation.
3. As a Cribl SE, I want to see the conceptual schema for each signal (Resource → InstrumentationScope → Span/Metric/LogRecord), so that I understand the object hierarchy and field relationships.
4. As a Cribl SE, I want to click on a Span in the trace tree and see its parent/child relationships highlighted, so that I can visually explain how distributed tracing works.
5. As a Cribl SE, I want to hover over schema fields and see a live inspector panel with type, description, constraints, and example values, so that I can answer detailed schema questions without referencing the OTel spec docs.
6. As a Cribl SE, I want to see an animated pipeline flow showing data moving from instrumentation → SDK → Collector → backends, so that I can explain the OTLP transport visually.
7. As a Cribl SE, I want to click on pipeline stages and see them highlighted with details about what happens at each stage, so that I can walk a customer through the data journey.
8. As a Cribl SE, I want to expand and collapse sections progressively, so that I can control the depth of information shown during a live walkthrough.
9. As a Cribl SE, I want a semantic conventions reference table (HTTP, database, messaging, host, service attributes), so that I can look up standard attribute names during customer conversations.
10. As a Cribl SE, I want a dedicated "Where Cribl Fits" section at the end, so that I can transition from OTel education to Cribl value proposition cleanly.
11. As a Cribl SE, I want to see how Cribl Stream/Edge intercepts OTLP and routes to multiple backends (traces to Jaeger, metrics to Prometheus, logs to Elasticsearch), so that I can explain the routing-at-ingest value prop.
12. As a Cribl SE, I want to interact with routing scenario selectors in the Cribl section, so that I can show different backend routing configurations interactively.
13. As a Cribl SE, I want the visual to use the official OTel color palette, so that it's instantly recognizable as OTel content to anyone familiar with the project.
14. As a Cribl SE, I want the Cribl section to use a distinct brand accent color, so that the transition from OTel education to Cribl value is visually clear.
15. As a Cribl SE, I want the page to work offline with no external CDN dependencies, so that I can use it in customer environments with restricted network access.
16. As a Cribl SE, I want the page to render correctly in any modern browser, so that I don't need special setup to present it.
17. As a Cribl SE, I want the page to have a logical top-to-bottom reading flow, so that someone can browse it solo as a reference.
18. As a Cribl SE, I want the progressive reveal toggles to act as natural breakpoints, so that I can use the page as an interactive presentation during screen-share.
19. As a Cribl SE, I want the Resource model explained as the shared foundation across all three signals, so that I can explain why OTel is unified rather than three separate standards.
20. As a Cribl SE, I want the InstrumentationScope concept explained, so that I can distinguish between application-level and library-level telemetry.
21. As a Cribl SE, I want to see Span fields (trace ID, span ID, parent span ID, spankind, start/end time, attributes, events, links, status), so that I can explain the anatomy of a span.
22. As a Cribl SE, I want to see Metric types (counter, gauge, histogram, exponential histogram, summary), so that I can explain the different metric instruments.
23. As a Cribl SE, I want to see LogRecord fields (timestamp, severity, body, attributes, trace correlation), so that I can explain how logs correlate with traces.
24. As a Cribl SE, I want to see how trace context propagation works across service boundaries, so that I can explain distributed tracing end-to-end.
25. As a Cribl SE, I want the page to be shareable as a single file, so that I can email it, drop it in Slack, or host it on GitHub Pages.

## Implementation Decisions

### Architecture

- **Single self-contained HTML file** — all CSS, JS, and data embedded inline. No external dependencies (no CDN fonts, no JS libraries, no CSS frameworks). Must work offline.
- **No build system** — the file is the artifact. No npm, no bundler, no transpiler. Pure HTML/CSS/vanilla JS.
- **No framework** — vanilla JS with DOM manipulation. The interactivity is simple enough that React/Vue/etc. would add weight without value.

### Modules

The following modules will be built as logical sections within the single HTML file:

1. **Theme & Design Tokens** (DATA) — CSS custom properties for the OTel palette (orange `#f5a800`, teal `#425cc7`, blue `#4285f4`), Cribl accent color, dark theme background, typography scale, spacing. Pure configuration.

2. **Signal Schema Renderer** (DEEP) — Core interactive component rendering the conceptual schema for each signal type. Renders the object hierarchy (Resource → InstrumentationScope → Span/Metric/LogRecord) with fields, attributes, and relationships. Handles clickable-highlight interactivity (click a Span → parent/child relationships light up). Pure functions for schema data lookups and relationship highlighting logic are extracted for testability.

3. **Pipeline Flow Animator** (DEEP) — Animated pipeline diagram showing data flowing: Instrumentation → SDK → Collector → (Cribl interception point) → Backends. Manages animation state machine (data packets moving along connectors, stage highlighting on hover/click). Pure functions for animation state transitions and path calculations are extracted for testability.

4. **Schema Inspector** (MEDIUM) — Live hover/click inspector panel showing field-level details. Takes a schema element reference and renders its type, description, constraints, and example values. Logic in pure lookup functions; presentation is DOM rendering.

5. **Signal Tab Switcher** (SHALLOW) — Tab navigation between Traces / Metrics / Logs. Toggles visibility of signal schema content and updates active tab styling. Thin orchestration.

6. **Reveal Toggle Controller** (SHALLOW) — Manages progressive disclosure expandable/collapsible sections. Generic show/hide with smooth transitions. Thin DOM manipulation.

7. **Semantic Conventions Reference** (DATA) — Static data table of common OTel semantic conventions (HTTP, database, messaging, host, service attributes). Embedded as JS data, rendered as expandable reference table. No logic.

8. **Cribl Integration Section** (MEDIUM) — Final "Where Cribl Fits" section showing how Cribl Stream/Edge intercepts OTLP, transforms signals, and routes to multiple backends. Combines static diagram with interactive routing scenario selectors. Logic in routing scenario data; presentation is diagram rendering.

### Visual Design

- OTel official palette: orange `#f5a800`, teal `#425cc7`, blue `#4285f4`
- Cribl brand accent in the final section (distinct visual transition)
- Dark theme (consistent with existing artifacts like `rag-explainer.html`)
- Monospace font family (system font stack for offline support, no Google Fonts)
- Card-based layout with borders and subtle background differentiation

### Interactivity

- **Signal tab switcher** — click Traces/Metrics/Logs to switch schema views
- **Clickable schema nodes** — click a Span/Metric/LogRecord to highlight relationships
- **Hover inspector** — hover over fields to see type, description, examples in a side panel
- **Animated pipeline flow** — data packets animate along the pipeline path, stages highlight on click
- **Reveal toggles** — expandable/collapsible sections throughout
- **Routing scenario selectors** — click different routing configs in the Cribl section

### Content Structure (top-to-bottom)

1. Header — title, subtitle
2. "What is OpenTelemetry?" — brief intro with the "one standard, three signals" framing
3. The Resource Model — shared foundation across all signals
4. Signal tabs — Traces / Metrics / Logs
   - Each tab shows the schema hierarchy with interactive nodes
5. Semantic Conventions — expandable reference table
6. OTLP Pipeline Architecture — animated flow diagram
7. Where Cribl Fits — dedicated section with routing scenarios

## Testing Decisions

### What makes a good test

- Test external behavior of pure functions, not DOM rendering or implementation details
- Pure functions extracted from DEEP and MEDIUM modules are the testing targets
- DOM rendering is presentation — test via manual verification, not automated tests

### Modules to be tested

- **Signal Schema Renderer** (Module 2, DEEP) — test schema data lookup functions (given a signal type and element ID, return the correct schema object) and relationship highlighting logic (given a span ID, return the correct set of parent/child span IDs that should be highlighted)
- **Pipeline Flow Animator** (Module 3, DEEP) — test animation state transitions (given current state + trigger, return next state) and path calculations (given start/end coordinates, return the correct intermediate points)
- **Schema Inspector** (Module 4, MEDIUM) — test the lookup functions (given a field reference, return the correct field metadata)
- **Cribl Integration Section** (Module 8, MEDIUM) — test routing scenario data (given a scenario ID, return the correct routing configuration)

### Testing approach

- Tests will be written as a separate test file (e.g., `test.js`) that can be run with Node.js
- Pure functions are extracted into a separate JS module (e.g., `otel-logic.js`) that can be imported by both the HTML file and the test file
- The HTML file includes `otel-logic.js` via a `<script>` tag
- The test file requires `otel-logic.js` as a Node module
- No test framework dependency — simple `assert`-based tests with a custom runner

## Out of Scope

- Protobuf-level schema definitions (staying at conceptual model level)
- OTel Collector configuration specifics (processors, exporters, connectors config syntax)
- Cribl Stream/Edge configuration details (pipeline, route, transform function syntax)
- Mobile-responsive design (desktop-first, may work on tablet but not optimized for phone)
- Multiple language support (English only)
- Backend-specific integration details (Jaeger, Prometheus, Elasticsearch setup)
- OTel SDK language-specific code examples (language-agnostic)
- Baggage, context propagation implementation details (conceptual only)
- Metrics aggregation temporality (cumulative vs delta) — mentioned but not deeply explored

## Further Notes

- The existing `rag-explainer.html` in the workspace is a reference for the dark-theme, monospace, card-based layout style. The OTel explainer should follow a similar visual weight but with the OTel color palette.
- The page should be performant — no heavy frameworks, no large data files. All interactivity is lightweight DOM manipulation.
- The animated pipeline flow should use CSS animations where possible (transitions, keyframes) rather than JS requestAnimationFrame loops, to keep it smooth and performant.
- The Cribl section should feel like a natural conclusion, not a sales pitch layered on top. The visual transition (color accent change) signals the shift from education to value prop.