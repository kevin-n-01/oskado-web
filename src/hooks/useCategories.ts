import type { Category } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useCategories = () => {
    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axios.get('/api/categories');
            return res.data;
        }
    })
}