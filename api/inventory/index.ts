import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../../src/lib/db';
import humps from 'humps';
import { handleServerError } from '../../server-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'POST') {
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
                                ${imagePath},
                                ${thumbnailPath}
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
