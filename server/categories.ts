import { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../src/lib/db";
import humps from 'humps';
import { handleServerError } from "../server-utils";

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
