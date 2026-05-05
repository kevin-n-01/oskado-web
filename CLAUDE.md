# Oskado Web — Claude Context

> **CRITICAL INSTRUCTION — READ FIRST:**
> **DO NOT WRITE CODE unless Kevin explicitly says "go ahead", "write it", or "write it for me."**
> This is a learning project. Provide guidance, explain concepts, and point to the right APIs and patterns. Stop short of implementation every time. No exceptions. This has been stated clearly multiple times and applies to all files: components, hooks, API routes, config, everything.

## Project Overview
Oskado is an inventory management web app for a clothing resale business. It was migrated from an Electron desktop app to a Vercel-deployed web app with a Neon Postgres database. The primary user is Kevin's girlfriend, who needs to quickly log purchased clothing items, track their status, and eventually list them for sale.

## How to Work with Kevin
**Do not write code unless Kevin explicitly asks you to.** This is a learning project. Provide guidance, explain concepts, point to the right APIs and patterns — but stop short of implementation unless he says "go ahead" or "write it for me." This has been stated clearly multiple times.

When a write operation touches multiple tables, proactively suggest a SQL transaction rather than separate endpoints.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, shadcn/ui components, Base UI (for advanced combobox/chip patterns)
- **State/Data:** TanStack Query (React Query v5) for server state, React Hook Form for form state
- **Routing:** React Router v7
- **Backend:** Vercel Serverless Functions (`/api` directory), `@vercel/node`
- **Database:** Neon Postgres (serverless), accessed via `postgres` npm package
- **HTTP:** axios
- **Utilities:** humps (snake_case ↔ camelCase), date-fns, lucide-react icons

## Architecture
- All API routes live in `/api` as individual Vercel serverless functions
- DB connection is in `src/lib/db.ts`
- All API responses are camelized via `humps.camelizeKeys()` before returning
- Frontend types live in `src/types.ts` (camelCase)
- Custom hooks in `src/hooks/` wrap TanStack Query for each resource
- Pages in `src/pages/`, shared components in `src/components/`

## Design Decisions
- Dark mode UI throughout
- shadcn/ui for standard form elements (Select, Checkbox, Button, Card, Dialog, etc.)
- Base UI `Combobox` used for multi-select chip pickers (e.g. ColorPicker) — use `isItemEqualToValue`, `itemToStringLabel`, `itemToStringValue` props when working with object values
- `FieldLabel` (renders `<label>`) should only be used where it maps to a native input. Use `FieldTitle` (renders `<div>`) for custom component fields to avoid unwanted focus behavior
- SKUs are text, auto-generated as `{category_short_name}-{nextval from inventory_sku_seq}`
- `is_child` stored as integer (0 or 1) in DB
- Inventory status tracked in `inventory_status_history` table, not as a column on `inventory`
- Many-to-many relationships use junction tables: `inventory_colors`, `inventory_fabrics`, `inventory_seasons`, `inventory_tags`, `inventory_websites`

## Current TODO
Full list also in [TODO.md](./TODO.md). Currently working on the inventory submission flow.

### Inventory Submission Flow
- [x] Create `inventory_websites` junction table in Neon (`inventory_sku` FK → inventory.sku, `website_id` FK → websites.id)
- [x] Create Postgres sequence `sku_number` for SKU generation (min 1 / max 1,000,000 / cache 5 / cycle)
- [x] Build `POST /api/inventory` endpoint — transaction: generate SKU → INSERT inventory → INSERT inventory_status_history (status: `Inventoried`) → return new SKU
- [x] Build confirmation dialog in AddItem — triggered by Submit, shows summary of all selections, two actions: "Save for Later" and "Add More Details"
- [x] Wire up "Save for Later" — calls POST /api/inventory, resets form, closes dialog
- [ ] Wire up "Add More Details" — calls POST /api/inventory, navigates to `/inventory/:sku/details`

### Add More Details Page (`/inventory/:sku/details`)
- [ ] Build GET + POST API endpoints + hooks for: fabrics, seasons, tags, websites (same pattern as brands/sizes)
- [ ] Build `PATCH /api/inventory/:sku` — updates condition, condition_description, box_id, listing_price + inserts into all 4 junction tables in a single transaction
- [ ] Build page UI with: condition (dropdown: Poor / Fair / Good / Like New / New With Tags), condition_description (textarea), box_id (integer input), listing_price (price input), seasons/tags/websites (multi-select using OptionSelector), fabrics (custom component — each row has a fabric dropdown + percentage input, with an "Add Fabric" button to append rows)
- [ ] Wire up "Add More Details" button in ConfirmItemDialog — reuses handleAddItem to get SKU, then navigates to `/inventory/:sku/details` via useNavigate

### Inventory Item Page — Visual Enhancements (deferred)
Ideas for filling the right side of the item page layout:
- **Status timeline** (preferred) — vertical timeline of status history with icon + date per step, replaces the Status History tab
- **Color swatch strip** — large row of color swatches, visually striking and meaningful
- **"At a glance" stat cards** — 2-3 small cards showing purchase price, listing price, days since inventoried
- **Large decorative image treatment** — full-bleed or background image instead of constrained left-side image
- **Subtle background gradient/texture** — visual weight on the right panel without adding content

### DB Notes
- `inventory` table already has: `condition`, `condition_description`, `box_id`, `listing_price` columns — no migration needed
- All junction tables exist: `inventory_fabrics`, `inventory_seasons`, `inventory_tags`, `inventory_websites`
- `box_id` is an integer — no separate boxes table, just store the box number directly
- `measurements` table exists in DB — confirm if in scope for detail page
- Colors already handled in first form via color swatch picker
