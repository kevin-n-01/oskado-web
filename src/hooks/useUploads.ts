import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export const useUpload = () => {
    return useMutation({
        mutationFn: async (image: File) => {
            const formData = new FormData();
            formData.append('image', image);
            const result = await axios.post('/api/upload', formData)
            return result;
        }
    })
}