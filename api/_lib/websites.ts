import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from './db';
import humps from 'humps';
import { handleServerError } from './utils';

export async function websitesHandler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const websites = await sql`SELECT * FROM websites ORDER BY website_name`;
            return res.status(200).json(humps.camelizeKeys(websites));
        } catch (error) {
            handleServerError(error, res);
        }
    }
}
