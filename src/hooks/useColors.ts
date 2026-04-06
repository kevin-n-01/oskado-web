import type { Color } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useColors = () => {
    return useQuery<Color[]>({
        queryKey:['colors'],
        queryFn: async() => {
            const res = await axios.get('/api/colors');
            return res.data;
        }
    })
}