import type { Brand } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';

export const useBrands = () => {
    return useQuery<Brand[]>({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await axios.get('/api/brands');
            return res.data;
        }
    })
}

export const useAddBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (brandName: string) => {
            const res = await axios.post('/api/brands', { brandName });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:[ 'brands']});
        }
    })
    
}