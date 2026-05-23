import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from './db';
import humps from 'humps';

export async function brandsHandler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const brands = await sql`SELECT * FROM brands ORDER BY brand_name`;
            return res.status(200).json(humps.camelizeKeys(brands));
        } catch (error) {
            console.error(error instanceof Error ? error.message : "Unknown Error");
            return res.status(500).json({error: error instanceof Error ? error.message : "Internal Server Error"})
        }

    } else if (req.method === 'POST') {
        try {
            const brand_name = req.body.brandName;
            if(!req.body.brandName) return res.status(400).json({error: "Brand Name must be provided"});

            const existing = await sql`SELECT id FROM brands WHERE LOWER(brand_name) = LOWER(${brand_name})`;
            if(existing.length > 0) return res.status(400).json({error: "Brand Name already exists"});

            const result = await sql`INSERT INTO brands (brand_name) VALUES (${brand_name}) RETURNING * `;
            return res.status(201).json(humps.camelizeKeys(result[0]));
        } catch(error) {
            console.error(error instanceof Error ? error.message : "Unknown Error");
            return res.status(500).json({error: error instanceof Error ? error.message : "Internal Server Error"})
        }

    }

}
