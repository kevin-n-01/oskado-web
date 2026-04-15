import type { Fabric } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFabrics = () => {
    return useQuery<Fabric[]>({
        queryKey: ['fabrics'],
        queryFn: async () => {
            const res = await axios.get('/api/fabrics');
            return res.data;
        }
    })
}
