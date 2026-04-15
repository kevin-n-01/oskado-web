import type { Tag } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTags = () => {
    return useQuery<Tag[]>({
        queryKey: ['tags'],
        queryFn: async () => {
            const res = await axios.get('/api/tags');
            return res.data;
        }
    })
}
