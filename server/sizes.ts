import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../src/lib/db';
import humps from 'humps';
import { handleServerError } from '../server-utils';

export async function sizesHandler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const sizes = await sql`SELECT * FROM sizes ORDER BY size`;
            return res.status(200).json(humps.camelizeKeys(sizes));
        } catch (error) {
            handleServerError(error, res);
        }
    } else if (req.method === 'POST') {
        try {
            const { size } = req.body;
            if (!size) return res.status(400).json({ error: "Size must be provided" });
            const existing = await sql`SELECT id FROM sizes WHERE LOWER(size) = LOWER(${size})`;
            if (existing.length > 0) return res.status(400).json({ error: "Size already exists" });
            const result = await sql`INSERT INTO sizes (size) VALUES (${size}) RETURNING *`;
            return res.status(201).json(humps.camelizeKeys(result[0]));
        } catch (error) {
            handleServerError(error, res);
        }
    }
}
