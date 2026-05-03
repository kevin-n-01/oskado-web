import { GENDERS } from '@/lib/constants';
import { z } from 'zod';

export const addItemSchema = z.object({
    shortDescription: z.string().min(1, "Please add a Short Description"),
    brandId: z.number().optional(),
    categoryId: z.number({ message: "Please Select a Product Category"}).min(1, "Please Select a Product Category"),
    subCategoryId: z.number().optional(),
    locationId: z.number({ message: "Please Select a Purchase Location" }).min(1, "Please Select a Purchased Location"),
    purchasePrice: z.number({ message: "Please add a purchase price for the item." }).min(.01, "Please add a purchase price for the item."),
    datePurchased: z.date().refine(d => d.getTime() <= new Date().getTime(), {error: "Purchase Date must be today or earlier"}).optional(),
    colorIds: z.array(z.number()).optional(),
    gender: z.enum(GENDERS, { message: "Please select a gender for this item"}),
    sizeId: z.number().optional(),
    isChild: z.boolean().optional(),
    imageFile: z.instanceof(File).refine((f) => f.type.startsWith('image/'), {error: "Uploaded file must be an image"}).optional()
})

export type AddItemForm = z.infer<typeof addItemSchema>;