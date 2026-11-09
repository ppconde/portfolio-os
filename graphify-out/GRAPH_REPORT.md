# Graph Report - portfolio-os  (2026-11-09)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2183 nodes · 2628 edges · 185 communities (41 shown, 144 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af314e24`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Workers AI Model Types
- MancalaLounge.tsx
- contact.tsx
- BiosScreen.tsx
- Test Plan: Basic Operations for Portfolio OS App
- Playwright CI Workflow
- compilerOptions
- Dependabot Configuration
- package.json
- Console API
- DesktopContent.tsx
- Compression and Transform Streams
- URL API
- Event
- Navbar.tsx
- Dependabot Build Check
- dependencies
- URLSearchParams API
- Website Navigation Layout
- Durable Object Storage
- Biome Linter Rules
- HTML Rewriter Element
- Headers API
- Web Crypto SubtleCrypto
- NPM Scripts
- Root TypeScript Config
- Blob and File API
- Request and Response Body
- Cloudflare Containers API
- FormData API
- URLPattern API
- @playwright/test
- Durable Object State
- Worker Entrypoint
- Paint App
- @react-router/dev
- Biome File Settings
- pnpm Workspace Config
- Image Upload Errors
- Artifacts
- OSWindow.tsx
- Biome CSS Formatter
- ServiceWorkerGlobalScope
- Flagship Feature Flags
- R2 Object Body
- Stream Queuing Strategies
- Writable and Digest Streams
- Durable Object Class
- Durable Object Transactions
- ReadableStream API
- TCP Socket API
- Writable Stream Writer
- Start Menu
- Biome JavaScript Formatter
- Durable Object Namespace
- R2 Bucket API
- SQL Storage Cursor
- Vectorize API
- Workers AI Binding
- AI Search Namespace
- BYOB Stream Reader
- Vectorize Index
- Workflow Instance API
- Biome Assist Actions
- AI Search Item
- AI Search Items
- Artifacts Repo Tokens
- D1 Database API
- D1 Prepared Statements
- KV Namespace API
- Byte Stream Controller
- Readable Stream Reader
- Text Decoding
- AI Gateway Logs
- HTML Comment Rewriting
- Email Message Handling
- HTML Rewriter
- Rewriter Document Handlers
- Image Handle Operations
- BYOB Stream Requests
- Readable Stream Controller
- Stream Video Captions
- Stream Video Handle
- Stream Video Watermarks
- Sync KV Storage
- WebAssembly Table
- HTML Text Rewriting
- Text Encoding
- Transform Stream Controller
- Biome Import Style
- Biome VCS Config
- Abort Controller
- AI Search Job
- AI Search Jobs
- AutoRAG Search
- Cache API
- Web Crypto
- D1 Database Sessions
- Durable Object Facets
- HTML End Tag
- Hosted Images Binding
- Rewriter Element Handlers
- Image Transformation Result
- Image Transformer
- Media Transformation Result
- WebAssembly Module
- Performance Timing
- Queue Producer
- R2 Multipart Upload
- Stream Video Binding
- Stream Video Downloads
- WebSocket Auto-Response
- Workflow Bindings
- Workflow Entrypoint
- Image Transform Options
- Colo-Local Actor Namespace
- RPC Stub Disposal
- DOM Exceptions
- Durable Object IDs
- Worker Execution Context
- WebAssembly Global
- Hello World Binding
- Images Binding
- Media Transformer
- WebAssembly Memory
- Queue Message Batch
- Node-Style Server
- Pipeline Transformation Entrypoint
- Tracing Spans
- SQL Storage
- Markdown Conversion Service
- Dynamic Worker Loader
- Worker Stub
- Workflow Steps
- Writable Stream Controller
- Analytics Engine Dataset
- Base Worker Env
- Cache Purge Context
- Cache Storage API
- Wasm Compile Error
- Dispatch Namespace
- HTML Rewriter Document End
- Event Listener Object
- Hyperdrive Connection
- Bot Management Properties
- Workflow Instance
- JSON Web Keys
- Media Binding Input
- Media Transformation Output
- Message Channel
- Navigator Send Beacon
- Non-Retryable Workflow Error
- Pipeline Send
- R2 Checksums
- Rate Limit Binding
- Function Tool Call Responses
- RPC Target Branding
- Wasm Runtime Error
- Scheduled Controller
- Scheduler Wait
- Secrets Store Secret
- Send Email Binding
- Stream Videos API
- Fetch Trace Request Info
- Tracing Spans
- Unsafe Trace Metrics
- Graphify Graph Rules
- Durable Object Brand
- Request Handler Entry
- RPC Stub Brand
- RPC Target Brand
- Worker Entrypoint Brand
- Workflow Entrypoint Brand
- root.tsx
- devDependencies
- compilerOptions
- AiSearchInstance
- Critique: animation & motion (site-wide)
- Critique: whole site (Ppconde OS)
- entry.server.tsx
- Dev Notes for portfolio-os

## God Nodes (most connected - your core abstractions)
1. `Event` - 25 edges
2. `useRoomStore` - 22 edges
3. `Console` - 21 edges
4. `Room` - 19 edges
5. `react` - 18 edges
6. `URLSearchParams` - 16 edges
7. `DurableObjectStorage` - 15 edges
8. `Element` - 14 edges
9. `Headers` - 14 edges
10. `SubtleCrypto` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Playwright Test Planner Agent` --conceptually_related_to--> `Test Plan: Basic Operations for Portfolio OS App`  [INFERRED]
  .github/agents/playwright-test-planner.agent.md → e2e/README.md
- `Test Plan: Basic Operations for Portfolio OS App` --references--> `🖥️ Portfolio Operating System`  [INFERRED]
  e2e/README.md → README.md
- `Room` --references--> `TableState`  [EXTRACTED]
  workers/room.ts → app/room.ts
- `fresh()` --calls--> `newBoard()`  [EXTRACTED]
  workers/room.ts → app/mancala.ts
- `App()` --calls--> `Screen`  [EXTRACTED]
  app/root.tsx → app/components/OS/Screen.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Playwright plan-generate-heal test pipeline** — _github_agents_playwright_test_planner_agent_playwright_test_planner, _github_agents_playwright_test_generator_agent_playwright_test_generator, _github_agents_playwright_test_healer_agent_playwright_test_healer, e2e_readme_test_plan_basic_operations [INFERRED 0.85]

## Communities (185 total, 144 thin omitted)

### Community 0 - "Workers AI Model Types"
Cohesion: 0.00
Nodes (785): RFC-2253, RFC-3339, RFC-5246, Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Input, Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Output, Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Async_Batch, Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_AsyncResponse, Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Chat_Completion_Response (+777 more)

### Community 1 - "MancalaLounge.tsx"
Cohesion: 0.05
Nodes (74): BEANS, Board(), BoardProps, COLS, Mancala(), Stones(), STORES, [TOP, BOTTOM, R] (+66 more)

### Community 3 - "contact.tsx"
Cohesion: 0.12
Nodes (19): Credits(), inspirations, A(), ContentEntry(), H2(), Project, ProjectCard(), Section() (+11 more)

### Community 4 - "BiosScreen.tsx"
Cohesion: 0.22
Nodes (14): BiosScreen(), session, skipToDesktop(), STEP_DELAYS, BlinkCaret(), Screen, reboot(), ShutdownScreen() (+6 more)

### Community 5 - "Test Plan: Basic Operations for Portfolio OS App"
Cohesion: 0.20
Nodes (9): Playwright Test Generator Agent, Playwright Test Healer Agent, Playwright Test Planner Agent, App Boot and Desktop Load (BIOS to Desktop), Start Menu Operations Tests, Test Plan: Basic Operations for Portfolio OS App, Window Management Tests, Credits (+1 more)

### Community 6 - "Playwright CI Workflow"
Cohesion: 0.08
Nodes (29): GITHUB_KEY, jobs, test, typecheck, name, on, pull_request, push (+21 more)

### Community 7 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, composite, esModuleInterop, jsx, lib, module, moduleResolution, paths (+8 more)

### Community 9 - "Dependabot Configuration"
Cohesion: 0.09
Nodes (22): patterns, prefix, actions, major-updates, minor-and-patch, security-updates, patterns, update-types (+14 more)

### Community 10 - "package.json"
Cohesion: 0.12
Nodes (15): name, packageManager, private, sideEffects, type, @biomejs/biome, @cloudflare/workers-types, @react-router/cloudflare (+7 more)

### Community 13 - "DesktopContent.tsx"
Cohesion: 0.17
Nodes (14): APPS, MancalaLounge, Paint, Icon(), AppsNames, CREDITS, MANCALA, PAINT (+6 more)

### Community 14 - "Compression and Transform Streams"
Cohesion: 0.10
Nodes (7): CompressionStream, DecompressionStream, FixedLengthStream, IdentityTransformStream, TextDecoderStream, TextEncoderStream, TransformStream

### Community 16 - "Event"
Cohesion: 0.04
Nodes (12): CloseEvent, CustomEvent, EmailEvent, ErrorEvent, Event, ExtendableEvent, FetchEvent, MessageEvent (+4 more)

### Community 17 - "Navbar.tsx"
Cohesion: 0.22
Nodes (12): Clock(), DesktopContent(), Navbar(), NavBarButton(), VerticalSeparator(), fmt(), useTime(), DesktopWindow (+4 more)

### Community 18 - "Dependabot Build Check"
Cohesion: 0.12
Nodes (16): if, runs-on, steps, jobs, build, name, on, pull_request (+8 more)

### Community 19 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, classnames, isbot, react, react-dom, react-draggable, react-router, @react-router/cloudflare (+3 more)

### Community 24 - "Website Navigation Layout"
Cohesion: 0.24
Nodes (8): NavItem(), LINKS, NavList(), HamburgerButton(), WebsiteLayout(), WebsiteHome(), classnames, react-router

### Community 27 - "Biome Linter Rules"
Cohesion: 0.13
Nodes (15): preset, noUnusedImports, useExhaustiveDependencies, useHookAtTopLevel, linter, enabled, rules, useTailwindSortedClasses (+7 more)

### Community 31 - "NPM Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, check, debug, deploy, dev, format, lint (+5 more)

### Community 32 - "Root TypeScript Config"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, checkJs, module, moduleResolution, noEmit, paths, skipLibCheck (+4 more)

### Community 34 - "Request and Response Body"
Cohesion: 0.15
Nodes (3): Body, Request, Response

### Community 47 - "Paint App"
Cohesion: 0.24
Nodes (10): COLORS, floodFill(), getCtx(), Paint(), SIZES, Tool, TOOL_SPRITE, TOOLS (+2 more)

### Community 48 - "@react-router/dev"
Cohesion: 0.29
Nodes (4): @cloudflare/vite-plugin, @react-router/dev, @tailwindcss/vite, vite

### Community 49 - "Biome File Settings"
Cohesion: 0.18
Nodes (10): files, includes, parser, overrides, allowComments, allowTrailingCommas, $schema, tailwind (+2 more)

### Community 50 - "pnpm Workspace Config"
Cohesion: 0.18
Nodes (10): allowBuilds, esbuild, msgpackr-extract, @parcel/watcher, sharp, @tailwindcss/oxide, unrs-resolver, workerd (+2 more)

### Community 51 - "Image Upload Errors"
Cohesion: 0.18
Nodes (11): AlreadyUploadedError, BadRequestError, ForbiddenError, InternalError, InvalidURLError, MaxFileSizeError, NotFoundError, QuotaReachedError (+3 more)

### Community 57 - "OSWindow.tsx"
Cohesion: 0.29
Nodes (8): OSWindow(), OSWindowProps, ButtonProps, WindowButton(), frame(), Zoom, ZoomOutline(), react-draggable

### Community 58 - "Biome CSS Formatter"
Cohesion: 0.20
Nodes (10): css, formatter, parser, formatter, enabled, indentStyle, indentWidth, lineEnding (+2 more)

### Community 59 - "ServiceWorkerGlobalScope"
Cohesion: 0.04
Nodes (7): AbortSignal, EventSource, EventTarget, MessagePort, ServiceWorkerGlobalScope, WebSocket, WorkerGlobalScope

### Community 63 - "Stream Queuing Strategies"
Cohesion: 0.22
Nodes (3): ByteLengthQueuingStrategy, CountQueuingStrategy, QueuingStrategy

### Community 72 - "Start Menu"
Cohesion: 0.46
Nodes (5): Start(), StartWindow(), StartWindowProps, useClickOutside(), react

### Community 73 - "Biome JavaScript Formatter"
Cohesion: 0.25
Nodes (8): arrowParentheses, jsxQuoteStyle, quoteStyle, semicolons, trailingCommas, javascript, formatter, formatter

### Community 90 - "Biome Assist Actions"
Cohesion: 0.33
Nodes (6): source, assist, actions, enabled, organizeImports, useSortedAttributes

### Community 123 - "Biome Import Style"
Cohesion: 0.67
Nodes (3): style, useImportType, useNodejsImportProtocol

### Community 124 - "Biome VCS Config"
Cohesion: 0.50
Nodes (4): vcs, clientKind, enabled, useIgnoreFile

### Community 150 - "Image Transform Options"
Cohesion: 0.67
Nodes (3): BasicImageTransformations, RequestInitCfPropertiesImage, RequestInitCfPropertiesImageDraw

### Community 279 - "root.tsx"
Cohesion: 0.19
Nodes (4): BlueScreen(), restart(), App(), ErrorBoundary()

### Community 280 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @biomejs/biome, @cloudflare/vite-plugin, @cloudflare/workers-types, @playwright/test, @react-router/dev, tailwindcss, @types/node (+5 more)

### Community 281 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, composite, lib, module, moduleResolution, strict, target, types (+3 more)

### Community 283 - "Critique: animation & motion (site-wide)"
Cohesion: 0.25
Nodes (7): Critique: animation & motion (site-wide), Heuristics: 18/36 (Acceptable, 50%). 10 n/a., Minor, Personas, Priority issues, Questions, Specificity

### Community 284 - "Critique: whole site (Ppconde OS)"
Cohesion: 0.29
Nodes (6): Critique: whole site (Ppconde OS), Heuristics: 16/32 (Acceptable, 50%). 7 and 10 n/a., Minor, Personas, Priority issues, Specificity

### Community 286 - "Dev Notes for portfolio-os"
Cohesion: 0.50
Nodes (3): CI, Dev Notes for portfolio-os, Local Development Checklist

## Knowledge Gaps
- **1013 isolated node(s):** `Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Input`, `Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Output`, `Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Async_Batch`, `Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_AsyncResponse`, `Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Chat_Completion_Response` (+1008 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1697 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **144 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-router` connect `Website Navigation Layout` to `contact.tsx`, `package.json`, `DesktopContent.tsx`, `root.tsx`, `entry.server.tsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **What connects `Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Input`, `Ai_Cf_Ai4Bharat_Indictrans2_En_Indic_1B_Output`, `Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27B_It_Async_Batch` to the rest of the system?**
  _1013 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Workers AI Model Types` be split into smaller, more focused modules?**
  _Cohesion score 0.0025348542458808617 - nodes in this community are weakly interconnected._
- **Why does `Console` connect `Console API` to `Workers AI Model Types`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `MancalaLounge.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05190440627333831 - nodes in this community are weakly interconnected._
- **Why does `Container` connect `Cloudflare Containers API` to `Workers AI Model Types`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `contact.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11522048364153627 - nodes in this community are weakly interconnected._