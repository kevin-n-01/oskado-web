import type { Inventory, InventoryForm } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"


export const useAddInventory = () => {
    return useMutation<{ sku: string }, Error, InventoryForm>({
        mutationFn: async (inventory: InventoryForm) => {
            const result = await axios.post('/api/inventory', {
                ...inventory,
                datePurchased: inventory.datePurchased.toISOString()
            })
            return result.data;
        },
        // TODO: Add invalidation for inventories once added for refetch
    })
}

export const useUpdateInventory = (sku: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<Inventory> & {
            fabrics?: { fabricId: number; percentage: number }[];
            seasonIds?: number[];
            tagIds?: number[];
            websiteIds?: number[];
        }) => {
            const res = await axios.patch(`/api/inventory/${sku}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory', sku] });
        }
    })
}

export const useInventoryItem = (sku: string) => {
    return useQuery<Inventory>({
        queryKey: ['inventory', sku],
        queryFn: async () => {
            const res = await axios.get(`/api/inventory/${sku}`);
            return res.data[0];
        },
        enabled: !!sku,
    })
}
