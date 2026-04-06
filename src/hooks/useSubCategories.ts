import type { SubCategory } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

type useAddSubcategoryProps = {
    categoryId: number;
    subCategoryName: string;
}
type useAddSubCategoryReturn = useAddSubcategoryProps & {
    id: number;
}

export const useSubCategories = (categoryId: number | null) => {
    return useQuery<SubCategory[]>({
        queryKey: ['subCategories', categoryId],
        queryFn: async () => {
            const res = await axios.get(`/api/subCategories?categoryId=${categoryId}`);
            return res.data;
        },
        enabled: !!categoryId
    })
}

export const useAddSubcategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["addCategory"],
        mutationFn: async ({categoryId, subCategoryName}: useAddSubcategoryProps): Promise<useAddSubCategoryReturn>  => {
            const res = await axios.post('/api/subCategories', { categoryId, subCategoryName })
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['subCategories']})
        }
    })
}