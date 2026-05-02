import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../src/lib/db';
import humps from 'humps';
import { handleServerError } from '../server-utils';

export async function seasonsHandler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const seasons = await sql`SELECT * FROM seasons ORDER BY season_name`;
            return res.status(200).json(humps.camelizeKeys(seasons));
        } catch (error) {
            handleServerError(error, res);
        }
    }
}
