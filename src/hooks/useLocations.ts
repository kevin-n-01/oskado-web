import { type Location } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios";

export const useLocations = () => {
    return useQuery<Location[]>({
        queryKey: ['locations'],
        queryFn: async () => {
            const res = await axios.get('/api/locations');
            return res.data;
        }
    })
}

export const useAddLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (location: Location) => {
            const res = await axios.post('/api/locations', location)
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['locations']});
        }
    })
}