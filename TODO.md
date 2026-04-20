# Oskado TODO

## Inventory Submission Flow

- [x] **#1** Create `inventory_websites` junction table in Neon
  - `inventory_sku` (FK → inventory.sku), `website_id` (FK → websites.id)
  - Check websites table schema first

- [x] **#2** Create Postgres sequence for SKU generation (`sku_number`, min 1 / max 1,000,000 / cache 5 / cycle)
  - Global `inventory_sku_seq` sequence
  - Backend prefixes with category `short_name` (e.g. `TOP-1`, `TOP-2`)
  - Confirm date format for `inventory_status_history.changed_at` (currently text)

- [x] **#3** Build `POST /api/inventory` endpoint
  - Transaction: generate SKU → INSERT inventory → INSERT inventory_status_history (status: `Inventoried`)
  - Returns new SKU

- [ ] **#4** Build confirmation dialog in AddItem
  - Triggered by Submit button
  - Shows summary of all selections (description, category, sub-category, brand, colors, gender, size, is_child, purchase price, date, location)
  - Two actions: "Save for Later" and "Add More Details"

- [ ] **#5** Wire up "Save for Later" action
  - Calls `POST /api/inventory`
  - Resets form and closes dialog for next item entry

- [ ] **#6** Wire up "Add More Details" action
  - Calls `POST /api/inventory`
  - Navigates to `/inventory/:sku/details` with the new SKU

## Add More Details Page

- [ ] **#7** Build Add More Details page (`/inventory/:sku/details`)
  - Condition (dropdown: Poor / Fair / Good / Like New / New With Tags)
  - Condition Description (textarea)
  - Box (selector)
  - Fabrics (multi-select → `inventory_fabrics`)
  - Seasons (multi-select → `inventory_seasons`)
  - Tags (multi-select → `inventory_tags`)
  - Websites (multi-select → `inventory_websites`)

- [ ] **#8** Build API endpoints and hooks for detail page
  - GET endpoints + hooks for: fabrics, seasons, tags, websites, boxes
  - PATCH/PUT endpoint to update inventory record with detail fields
  - POST endpoints for junction tables: inventory_fabrics, inventory_seasons, inventory_tags, inventory_websites

## TableSelector Component (in progress)

`TableSelector` is a reusable dynamic table input where columns are defined by a schema and rows are added dynamically. Currently being wired into `EditItemDetails.tsx` for fabrics. File: `src/components/TableSelector.tsx`.

### Remaining work

1. **Accept `columns` and `optionsMap` as props** — remove hardcoded `fabricColumns` from inside the component. `optionsMap` is `Record<string, DropDownOption[]>` keyed by column key.
2. **Remove `options` from the dropdown `ColumnDef` variant** — `renderCell` should look up options via `optionsMap[col.key]` instead.
3. **Add `onChange: (rows: RowData[]) => void` prop** — call it in a `useEffect` whenever `rowList` changes so the parent can receive the current row data.
4. **Wire into `EditItemDetails`** — call `useFabrics()`, define `fabricColumns` (key: `"fabric"`, type: `"dropdown"` and key: `"percentage"`, type: `"number"`), pass `optionsMap={{ fabric: fabricData }}`, and use RHF's `setValue('fabrics', rows)` in the `onChange` callback.

### Current component state
- `ColumnDef` discriminated union: `text | number | dropdown`
- `RowData` is `Record<string, string | number>`
- `handleAddRow` initializes a new empty row from the column schema
- `handleCellChange(rowIndex, key, value)` updates the correct cell via functional `setRowList`
- `renderCell(col, onChange)` switches on `col.type` and calls `onChange(col.key, value)` — `rowIndex` is captured via closure at the call site
- `useFabrics` hook already exists and is ready to use

## Notes
- `measurements` table exists in DB — confirm if in scope for detail page
- Colors are already handled in the first form via the color swatch picker
