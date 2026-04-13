import type { InventoryForm } from "@/types"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"


export const useAddInventory = () => {
    // const queryClient = useQueryClient();
    return useMutation({
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