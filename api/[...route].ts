import type { VercelRequest, VercelResponse } from '@vercel/node';
import { brandsHandler } from '../server/brands';
import { categoriesHandler } from '../server/categories';
import { colorsHandler } from '../server/colors';
import { fabricsHandler } from '../server/fabrics';
import { locationsHandler } from '../server/locations';
import { measurementsHandler } from '../server/measurements';
import { seasonsHandler } from '../server/seasons';
import { sizesHandler } from '../server/sizes';
import { subCategoriesHandler } from '../server/subCategories';
import { tagsHandler } from '../server/tags';
import { websitesHandler } from '../server/websites';
import { requireAuth } from '../server/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {

    const path = req.url!.replace('/api/', '').split('?')[0];

    if (await requireAuth(req, res)) return;

    console.log("Now routing API call to ", path);
    
    if (path === 'brands') return brandsHandler(req, res);
    if (path === 'categories') return categoriesHandler(req, res);
    if (path === 'colors') return colorsHandler(req, res);
    if (path === 'fabrics') return fabricsHandler(req, res);
    if (path === 'locations') return locationsHandler(req, res);
    if (path === 'measurements') return measurementsHandler(req, res);
    if (path === 'seasons') return seasonsHandler(req, res);
    if (path === 'sizes') return sizesHandler(req, res);
    if (path === 'subCategories') return subCategoriesHandler(req, res);
    if (path === 'tags') return tagsHandler(req, res);
    if (path === 'websites') return websitesHandler(req, res);

    return res.status(404).json({ error: 'Not found' });
}
