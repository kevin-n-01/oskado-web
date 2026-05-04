import z from "zod";

export const itemListedSchema = z.object({
    boxId: z.number({message: "Please enter a box number"}).min(1, "Please enter a box number"),
    listingPrice: z.number({ message: "Please enter a listing price" }),
    listingDate: z.date().optional(),
    websiteIds: z.array(z.number())
})

export type ItemListedForm = z.infer<typeof itemListedSchema>;