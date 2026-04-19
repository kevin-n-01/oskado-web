import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../src/lib/db';
import humps from 'humps';
import { handleServerError } from '../server-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const tags = await sql`SELECT * FROM tags ORDER BY tag_text`;
            return res.status(200).json(humps.camelizeKeys(tags));
        } catch (error) {
            handleServerError(error, res);
        }
    } else if (req.method === 'POST') {
        try {
            const tagText = req.body.tagText
            if(!tagText) return res.status(400).json({error: "No Tag Name Provided"});

            const result = await sql`
                INSERT INTO tags (tag_text) VALUES (${tagText}) RETURNING *
            `
            return res.status(201).json(humps.camelizeKeys(result));
        } catch(e) {
            handleServerError(e, res);
        }
    }
}
