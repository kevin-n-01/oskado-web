import { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "./lib/db";
import humps from 'humps';
import { handleServerError } from "../server-utils";

export async function subCategoriesHandler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            if (!req.query.categoryId) return res.status(400).json({ error: "Category ID must be provided" });
            const categoryId = req.query.categoryId;
            const subCategories = await sql`SELECT * FROM sub_categories WHERE category_id = ${categoryId} ORDER BY sub_category_name`;
            return res.status(200).json(humps.camelizeKeys(subCategories));
        } catch (error) {
            handleServerError(error, res);
        }
    } else if (req.method === 'POST') {
        try {
            const subCategoryName = req.body.subCategoryName;
            const categoryId = req.body.categoryId;
            if (!(subCategoryName && categoryId)) return res.status(400).json({ error: "Invalid Schema" });
            const existing = await sql`SELECT * FROM sub_categories WHERE category_id = ${categoryId} AND sub_category_name = ${subCategoryName}`;
            if (existing && existing.length > 0) return res.status(400).json({ error: "This value already exists in sub categories" });
            const result = await sql`INSERT INTO sub_categories (category_id, sub_category_name) VALUES (${categoryId}, ${subCategoryName}) RETURNING *`;
            return res.status(201).json(humps.camelizeKeys(result[0]));
        } catch (error) {
            handleServerError(error, res);
        }
    }
}
