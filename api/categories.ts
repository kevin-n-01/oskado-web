import { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../src/lib/db";

const handler = async (req:VercelRequest, res: VercelResponse) => {
    if(req.method === 'GET') {
        try {
            const categories = await sql`SELECT * FROM categories ORDER BY category_name`;
            return res.status(200).json(categories);
        } catch(error) {
            console.error(error instanceof Error ? error.message : "Unknown Error");
            return res.status(500).json({error: error instanceof Error ? error.message : "Internal Server Error"});
        }
    }
}

export default handler;