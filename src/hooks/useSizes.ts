import type { Size } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useSizes = () => {
    return useQuery<Size[]>({
        queryKey: ['sizes'],
        queryFn: async () => {
            const res = await axios.get('/api/sizes');
            return res.data;
        }
    });
}

export const useAddSize = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (size: string) => {
            const res = await axios.post('/api/sizes', { size });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sizes'] });
        }
    });
}
