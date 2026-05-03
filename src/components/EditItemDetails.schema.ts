import { CONDITION_LIST, MEASUREMENT_UNITS } from "@/lib/constants";
import z from "zod";

export const editItemDetails = z.object({
    seasons: z.array(z.number()).optional(),
    tags: z.array(z.number()).optional(),
    condition: z.enum(CONDITION_LIST).optional(),
    conditionDescription: z.string().optional(),
    fabrics: z.array(z.object({
        fabricId: z.number( {message: "Please Select a Fabric Type" } ),
        percentage: z.number({message: "Please Select a Fabric Percentage"}).min(1).max(100)
    })).superRefine((fabrics, ctx) => {
        const total = fabrics.reduce( (sum, fabric) => sum + fabric.percentage, 0);
        if(total !== 100) {
            ctx.addIssue({
                code: "custom",
                message: `Fabric percentages must add up to 100 (currently ${total}).`
            })
        }
    }).optional(),
    measurements: z.array(z.object({
        measurementId: z.number({message: "Please select a measurement type"}),
        measurementValue: z.number(),
        measurementUnit: z.enum(MEASUREMENT_UNITS, { message: "Please select a unit"})
    })).optional()
})

export type EditItemForm = z.infer<typeof editItemDetails>;