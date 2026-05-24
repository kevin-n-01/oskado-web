import type { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "./db.js";
import humps from 'humps';
import { handleServerError } from "./utils.js";

export async function categoriesHandler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const categories = await sql`SELECT * FROM categories ORDER BY category_name`;
            return res.status(200).json(humps.camelizeKeys(categories));
        } catch (error) {
            handleServerError(error, res);
        }
    }
}
