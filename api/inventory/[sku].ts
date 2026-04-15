import { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../../src/lib/db";
import humps from 'humps';
import { handleServerError } from "../../server-utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
                WHERE sku = ${sku}
                GROUP BY
                i.sku
                , i.short_description
                , b.brand_name
                , c.category_name
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
    }
}