import { type Measurement } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export const useMeasurements = () => {
    return useQuery<Measurement[]>({
        queryKey: ['measurements'],
        queryFn: async () => {
            const result = await axios.get('/api/measurements');
            return result.data;
        }
    })
}

export const useAddMeasurement = () => {
    const queryClient = useQueryClient();
    return useMutation<Measurement, Error, string>({
        mutationFn: async (measurementName: string) => {
            const result = await axios.post('/api/measurements', measurementName);
            return result.data
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['measurements']})
    })}