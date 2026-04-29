import type { VercelRequest, VercelResponse } from '@vercel/node';
import { brandsHandler } from '../server/brands';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const path = req.url!.replace('/api/', '').split('?')[0];

    if (path === 'brands') return brandsHandler(req, res);

    return res.status(404).json({ error: 'Not found' });
}
