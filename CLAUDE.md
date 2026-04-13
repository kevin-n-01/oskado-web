# Oskado Web — Claude Context

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
- [ ] Build confirmation dialog in AddItem — triggered by Submit, shows summary of all selections, two actions: "Save for Later" and "Add More Details"
- [ ] Wire up "Save for Later" — calls POST /api/inventory, resets form, closes dialog
- [ ] Wire up "Add More Details" — calls POST /api/inventory, navigates to `/inventory/:sku/details`

### Add More Details Page (`/inventory/:sku/details`)
- [ ] Build API endpoints + hooks for: fabrics, seasons, tags, websites, boxes
- [ ] Build PATCH/PUT endpoint to update inventory record with detail fields
- [ ] Build POST endpoints for junction tables: inventory_fabrics, inventory_seasons, inventory_tags, inventory_websites
- [ ] Build page UI with: condition (dropdown), condition_description (textarea), box (selector), fabrics, seasons, tags, websites (all multi-select)

### Notes
- `measurements` table exists in DB — confirm if in scope for detail page
- Colors already handled in first form via color swatch picker
