import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from "../src/lib/db";
import humps from 'humps';
import { handleServerError } from '../server-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(req.method === 'GET') {
        try {
            const colors = await sql`SELECT * FROM colors ORDER BY color_name`;
            return res.status(200).json(humps.camelizeKeys(colors));
        } catch (error) {
            handleServerError(error, res);
        }
    } 
}