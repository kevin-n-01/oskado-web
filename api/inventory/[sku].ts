import type { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../_lib/db.js";
import humps from 'humps';
import { handleServerError } from "../_lib/utils.js";
import { requireAuth } from "../_lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(await requireAuth(req, res)) return;
    if(req.method === 'GET') {
        try {
            const sku = req.query.sku;
            if(!sku) return res.status(400).json({error: 'No inventory sku provided'});
            const item = await sql`
                WITH mostRecentStatus AS (
                    SELECT i.inventory_sku, i.status, i.changed_at
                    FROM inventory_status_history i
                    INNER JOIN (
                        SELECT inventory_sku, MAX(changed_at) AS changed_at FROM inventory_status_history GROUP BY inventory_sku
                    ) m ON i.inventory_sku = m.inventory_sku AND i.changed_at = m.changed_at
                )
                SELECT
                i.sku
                , i.short_description
                , b.brand_name
                , c.category_name
                , sub.sub_category_name
                , l.business_name
                , i.purchase_price
                , i.date_purchased
                , i.listing_price
                , i.condition
                , i.condition_description
                , i.gender
                , s.size
                , i.is_child
                , i.image_path
                , i.thumbnail_path
                , i.box_id
                , mrs.status
                , JSON_AGG(DISTINCT jsonb_build_object('colorName', col.color_name, 'hexcode', col.hex_code)) FILTER (WHERE col.color_name IS NOT NULL) AS colors
                , JSON_AGG(DISTINCT jsonb_build_object('fabricName', fab.fabric_name, 'percentage', i_f.percentage)) FILTER (WHERE fab.fabric_name IS NOT NULL) as fabrics
                , JSON_AGG(DISTINCT jsonb_build_object('measurementName', mea.measurement_name, 'measurementValue', im.measurement_value, 'measurementUnit', im.measurement_unit)) FILTER (WHERE mea.measurement_name IS NOT NULL) as measurements
                , ARRAY_REMOVE(ARRAY_AGG(DISTINCT seasons.season_name), NULL) AS seasons
                , ARRAY_REMOVE(ARRAY_AGG(DISTINCT t.tag_text), NULL) AS tags
                , ARRAY_REMOVE(ARRAY_AGG(DISTINCT web.website_name), NULL) AS websites
                FROM inventory i 
                LEFT JOIN brands b
                    on b.id = i.brand_id
                LEFT JOIN categories c
                    on c.id = i.category_id
                LEFT JOIN sub_categories sub
                    on sub.id = i.sub_category_id
                LEFT JOIN locations l
                    ON l.id = i.location_id
                LEFT JOIN sizes s
                    on s.id = i.size_id
                LEFT JOIN mostRecentStatus mrs
                    ON mrs.inventory_sku = i.sku
                LEFT JOIN inventory_colors ic
                    on ic.inventory_sku = i.sku
                LEFT JOIN colors col
                    on col.id = ic.color_id
                LEFT JOIN inventory_fabrics i_f
                    on i_f.inventory_sku = i.sku
                LEFT JOIN fabrics fab
                    ON i_f.fabric_id = fab.id
                LEFT JOIN inventory_seasons i_s
                    ON i_s.inventory_sku = i.sku
                LEFT JOIN seasons
                    ON seasons.id = i_s.season_id
                LEFT JOIN inventory_tags it
                    ON it.inventory_sku = i.sku
                LEFT JOIN tags t
                    ON t.id = it.tag_id
                LEFT JOIN inventory_websites iw
                    ON iw.inventory_sku = i.sku
                LEFT JOIN websites web
                    ON web.id = iw.website_id
                LEFT JOIN inventory_measurements im
                    ON im.inventory_sku = i.sku
                LEFT JOIN measurements mea
                    on mea.id = im.measurement_dim_id
                WHERE sku = ${sku}
                GROUP BY
                i.sku
                , i.short_description
                , b.brand_name
                , c.category_name
                , sub.sub_category_name
                , l.business_name
                , i.purchase_price
                , i.date_purchased
                , i.listing_price
                , i.condition
                , i.condition_description
                , i.gender
                , s.size
                , i.is_child
                , i.image_path
                , i.thumbnail_path
                , i.box_id
                , mrs.status`;
            return res.status(200).json(humps.camelizeKeys(item))
        } catch (error) {
            handleServerError(error, res);
        }
    } else if (req.method === 'PATCH') {
        try {
            const sku = req.query.sku as string;
            if (!sku) return res.status(400).json({ error: 'No inventory SKU provided' });

            const {
                shortDescription,
                brandId,
                categoryId,
                subCategoryId,
                locationId,
                sizeId,
                purchasePrice,
                datePurchased,
                gender,
                isChild,
                imagePath,
                thumbnailPath,
                listingPrice,
                condition,
                conditionDescription,
                boxId,
                fabrics,
                seasonIds,
                measurements,
                tagIds,
                websiteIds,
                status,
                notes,
                statusDate
            } = req.body;

            await sql.begin(async (sqlTx) => {
                const tx = sqlTx as unknown as typeof sql;

                await tx`
                    UPDATE inventory SET
                        short_description = COALESCE(${shortDescription ?? null}, short_description),
                        brand_id = COALESCE(${brandId ?? null}, brand_id),
                        category_id = COALESCE(${categoryId ?? null}, category_id),
                        sub_category_id = COALESCE(${subCategoryId ?? null}, sub_category_id),
                        location_id = COALESCE(${locationId ?? null}, location_id),
                        size_id = COALESCE(${sizeId ?? null}, size_id),
                        purchase_price = COALESCE(${purchasePrice ?? null}, purchase_price),
                        date_purchased = COALESCE(${datePurchased ?? null}, date_purchased),
                        gender = COALESCE(${gender ?? null}, gender),
                        is_child = COALESCE(${isChild ?? null}, is_child),
                        image_path = COALESCE(${imagePath ?? null}, image_path),
                        thumbnail_path = COALESCE(${thumbnailPath ?? null}, thumbnail_path),
                        listing_price = COALESCE(${listingPrice ?? null}, listing_price),
                        condition = COALESCE(${condition ?? null}, condition),
                        condition_description = COALESCE(${conditionDescription ?? null}, condition_description),
                        box_id = COALESCE(${boxId ?? null}, box_id)
                    WHERE sku = ${sku}
                `;

                if (fabrics?.length) {
                    const fabricIds = fabrics.map((f: { fabricId: number; percentage: number }) => f.fabricId);
                    const percentages = fabrics.map((f: { fabricId: number; percentage: number }) => f.percentage);
                    await tx`DELETE FROM inventory_fabrics WHERE inventory_sku = ${sku}`;
                    await tx`
                        INSERT INTO inventory_fabrics (inventory_sku, fabric_id, percentage)
                        SELECT ${sku}, unnest(${tx.array(fabricIds)}::int[]), unnest(${tx.array(percentages)}::real[])
                    `;
                }

                if (seasonIds?.length) {
                    await tx`DELETE FROM inventory_seasons WHERE inventory_sku = ${sku}`;
                    await tx`
                        INSERT INTO inventory_seasons (inventory_sku, season_id)
                        SELECT ${sku}, unnest(${tx.array(seasonIds)}::int[])
                    `;
                }

                if (tagIds?.length) {
                    await tx`DELETE FROM inventory_tags WHERE inventory_sku = ${sku}`;
                    await tx`
                        INSERT INTO inventory_tags (inventory_sku, tag_id)
                        SELECT ${sku}, unnest(${tx.array(tagIds)}::int[])
                    `;
                }

                if (websiteIds?.length) {
                    await tx`DELETE FROM inventory_websites WHERE inventory_sku = ${sku}`;
                    await tx`
                        INSERT INTO inventory_websites (inventory_sku, website_id)
                        SELECT ${sku}, unnest(${tx.array(websiteIds)}::int[])
                    `;
                }
                if(measurements?.length) {
                    const measurementIds = measurements.map((m: {measurementId: number; measurementValue: number; measurementUnit: string}) => m.measurementId);
                    const measurementValues = measurements.map((m: {measurementId: number; measurementValue: number; measurementUnit: string}) => m.measurementValue);
                    const measurementUnit = measurements.map((m: {measurementId: number; measurementValue: number; measurementUnit: string}) => m.measurementUnit);
                    await tx`DELETE FROM inventory_measurements WHERE inventory_sku = ${sku}`;
                    await tx`
                        INSERT INTO inventory_measurements (inventory_sku, measurement_dim_id, measurement_value, measurement_unit)
                        SELECT ${sku}, unnest(${tx.array(measurementIds)}::int[]), unnest(${tx.array(measurementValues)}::real[]), unnest(${tx.array(measurementUnit)}::text[])
                    `
                }
                if(status && notes) {
                    await tx`INSERT INTO inventory_status_history (inventory_sku, status, notes, changed_at) VALUES (${sku}, ${status}, ${notes}, ${statusDate ?? new Date()})`;
                }
            });

            return res.status(200).json({ sku });
        } catch (error) {
            handleServerError(error, res);
        }
    }
}