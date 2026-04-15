import type { Inventory, InventoryForm } from "@/types"
import { useMutation, useQuery } from "@tanstack/react-query"
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
