import { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../../server/lib/db";
import humps from 'humps';
import { handleServerError } from "../../../server-utils";
import { requireAuth } from "../../../server/auth";


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(await requireAuth(req, res)) return;
    
    if(req.method === 'GET') {
        try {
            const inventorySku = req.query.sku;
            if(!inventorySku) return res.status(400).json({error: "No inventory sku provided"});

            const color = await sql`SELECT
                                        c.color_name,
                                        c.hex_code
                                        FROM inventory_colors i
                                        INNER JOIN colors c
                                            ON i.color_id = c.id
                                        WHERE i.inventory_sku = ${inventorySku}`;
            return res.status(200).json(humps.camelizeKeys(color));
        } catch (error) {
            handleServerError(error, res);
        }
    } else if (req.method === 'POST') {
        try {
            const inventorySku = req.query.sku;
            const colorIds = req.body.colorIds;
            if(!inventorySku || !colorIds) return res.status(400).json({error: "Inventory SKU or color ids not valid."})
            const result = await sql`INSERT INTO inventory_colors (inventory_sku, color_id)
                                        SELECT ${inventorySku}, unnest(${sql.array(colorIds)}::int[])
                                    RETURNING *`;
            return res.status(201).json(humps.camelizeKeys(result))
        } catch(error) {
            handleServerError(error, res);
        }
    }
}