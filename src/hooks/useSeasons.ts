import type { Season } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useSeasons = () => {
    return useQuery<Season[]>({
        queryKey: ['seasons'],
        queryFn: async () => {
            const res = await axios.get('/api/seasons');
            return res.data;
        }
    })
}
