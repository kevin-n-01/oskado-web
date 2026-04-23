---
name: component-modularity
description: Enforces modular component structure — one component per file, master/orchestrator pattern for multi-section pages. Use whenever building or reviewing React components in this project.
---

# Component Modularity Rules

## Core Rule
Every component lives in its own file. Never build a large multi-section structure in a single file.

## Multi-Section Pages
When a page or dialog has multiple distinct sections (tabs, collapsibles, steps, panels):
- Create a **master/orchestrator file** that holds shared state and renders the sections
- Create **one file per section**
- Total: N sections + 1 orchestrator = N+1 files

### Example
A dialog with 3 collapsible sections:
```
EditItemDetails.tsx        ← orchestrator: holds state, assembles sections
EditPrimaryDetails.tsx     ← section 1
EditConditionDetails.tsx   ← section 2
EditMeasurements.tsx       ← section 3
```

## State Ownership
- Shared state (needed in onSubmit or passed between sections) lives in the orchestrator
- Section-local state (open/close, internal UI) lives in the section component
- Sections receive callbacks to push values up, not direct state setters where avoidable

## When to Split
If you're about to add a second major field group to an existing component file, stop and split first.
