import type { VercelRequest, VercelResponse } from '@vercel/node';
import { brandsHandler } from './_lib/brands';
import { categoriesHandler } from './_lib/categories';
import { colorsHandler } from './_lib/colors';
import { fabricsHandler } from './_lib/fabrics';
import { locationsHandler } from './_lib/locations';
import { measurementsHandler } from './_lib/measurements';
import { seasonsHandler } from './_lib/seasons';
import { sizesHandler } from './_lib/sizes';
import { subCategoriesHandler } from './_lib/subCategories';
import { tagsHandler } from './_lib/tags';
import { websitesHandler } from './_lib/websites';
import { requireAuth } from './_lib/auth';

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
