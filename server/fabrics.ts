import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../src/lib/db';
import humps from 'humps';
import { handleServerError } from '../server-utils';

export async function fabricsHandler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const fabrics = await sql`SELECT * FROM fabrics ORDER BY fabric_name`;
            return res.status(200).json(humps.camelizeKeys(fabrics));
        } catch (error) {
            handleServerError(error, res);
        }
    }
}
