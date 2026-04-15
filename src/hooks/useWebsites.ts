import type { Website } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useWebsites = () => {
    return useQuery<Website[]>({
        queryKey: ['websites'],
        queryFn: async () => {
            const res = await axios.get('/api/websites');
            return res.data;
        }
    })
}
