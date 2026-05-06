import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../../server/lib/db';
import humps from 'humps';
import { handleServerError } from '../../server-utils';
import { requireAuth } from '../../server/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(await requireAuth(req, res)) return;
    if(req.method === 'GET') {
        try {
            const items = await sql`
                WITH mostRecentStatus AS (
                    SELECT i.inventory_sku, i.status
                    FROM inventory_status_history i
                    INNER JOIN (
                        SELECT inventory_sku, MAX(changed_at) AS changed_at FROM inventory_status_history GROUP BY inventory_sku
                    ) m ON i.inventory_sku = m.inventory_sku AND i.changed_at = m.changed_at
                )
                SELECT
                    i.sku
                    , i.short_description
                    , i.gender
                    , i.is_child
                    , i.thumbnail_path
                    , b.brand_name
                    , c.category_name
                    , sub.sub_category_name
                    , s.size
                    , mrs.status
                FROM inventory i
                LEFT JOIN brands b ON b.id = i.brand_id
                LEFT JOIN categories c ON c.id = i.category_id
                LEFT JOIN sub_categories sub ON sub.id = i.sub_category_id
                LEFT JOIN sizes s ON s.id = i.size_id
                LEFT JOIN mostRecentStatus mrs ON mrs.inventory_sku = i.sku
            `;
            return res.status(200).json(humps.camelizeKeys(items));
        } catch (error) {
            handleServerError(error, res);
        }
    }
     else if (req.method === 'POST') {
        try {
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
                colorIds,
            } = req.body;

            if (!shortDescription || !categoryId || !locationId || !purchasePrice || !datePurchased) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const result = await sql.begin(async (sqlTx) => {
                const tx = sqlTx as unknown as typeof sql;
                const [{ sku }] = await tx`
                    WITH
                        sku_num AS (
                            SELECT nextval('sku_number') AS num
                        ),
                        category AS (
                            SELECT category_short_name FROM categories WHERE id = ${categoryId}
                        ),
                        new_sku AS (
                            SELECT category.category_short_name || '-' || LPAD(sku_num.num::text, 6, '0') AS sku
                            FROM sku_num, category
                        ),
                        inserted_inventory AS (
                            INSERT INTO inventory (
                                sku,
                                short_description,
                                brand_id,
                                category_id,
                                sub_category_id,
                                location_id,
                                size_id,
                                purchase_price,
                                date_purchased,
                                gender,
                                is_child,
                                image_path,
                                thumbnail_path
                            )
                            SELECT
                                new_sku.sku,
                                ${shortDescription},
                                ${brandId ?? null},
                                ${categoryId},
                                ${subCategoryId ?? null},
                                ${locationId},
                                ${sizeId ?? null},
                                ${purchasePrice},
                                ${datePurchased},
                                ${gender},
                                ${isChild ? 1 : 0},
                                ${imagePath ?? null},
                                ${thumbnailPath ?? null}
                            FROM new_sku
                            RETURNING sku
                        )
                    INSERT INTO inventory_status_history (inventory_sku, status, changed_at, notes)
                    SELECT sku, 'Inventoried', now(), 'New Item Added'
                    FROM inserted_inventory
                    RETURNING inventory_sku AS sku
                `;

                if (colorIds?.length) {
                    await tx`
                        INSERT INTO inventory_colors (inventory_sku, color_id)
                        SELECT ${sku}, unnest(${tx.array(colorIds)}::int[])
                    `;
                }

                return sku;
            });

            return res.status(201).json(humps.camelizeKeys({ sku: result }));
        } catch (error) {
            handleServerError(error, res);
        }
    }
}
