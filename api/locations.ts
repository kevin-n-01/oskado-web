import { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../src/lib/db';
import humps from 'humps';
import { handleServerError } from '../server-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(req.method === 'GET') {
        try {
            const locations = await sql`SELECT * FROM locations ORDER BY business_name`;
            return res.json(humps.camelizeKeys(locations));
        } catch(error) {
            handleServerError(error, res);
        }
    } else if (req.method === 'POST') {
        try {
            const { businessName, businessShortName, description, streetAddress, city, state, img } = req.body;
            if(!(businessName && businessShortName)) return res.status(400).json({error: "Business Name and Short Name required."});
            const result = await sql`INSERT INTO locations (business_name, short_name, description, street_address, city, state, image_path)
                VALUES (${businessName}, ${businessShortName}, ${description ?? null}, ${streetAddress ?? null}, ${city ?? null}, ${state ?? null}, ${img ?? null})
                RETURNING *`;
            return res.status(201).json(humps.camelizeKeys(result[0]));
        } catch(error) {
            handleServerError(error, res);
        }

    }
}