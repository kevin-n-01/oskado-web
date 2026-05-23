import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from "./db";
import humps from 'humps';
import { handleServerError } from './utils';

export async function colorsHandler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const colors = await sql`SELECT * FROM colors ORDER BY color_name`;
            return res.status(200).json(humps.camelizeKeys(colors));
        } catch (error) {
            handleServerError(error, res);
        }
    }
}
