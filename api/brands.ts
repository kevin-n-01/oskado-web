import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../src/lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const brands = await sql`SELECT * FROM brands ORDER BY brand_name`;
        return res.json(brands);
    } else if (req.method === 'POST') {
        const brand_name = req.body.brand_name;
        const result = await sql`INSERT INTO brands (brand_name) VALUES (${brand_name}) RETURNING * `;
        return res.json(result[0]);
    }

}