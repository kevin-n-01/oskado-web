import type { Tag } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useAddTag = () => {
    const queryClient = useQueryClient();
    return useMutation<Tag, Error, string>({
        mutationFn: async (tagText: string) => {
            const res = await axios.post('/api/tags', {tagText});
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['tags']})
    })
}
