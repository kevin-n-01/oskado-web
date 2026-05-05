import InventoryTile, { LoadingInventoryTile } from "@/components/InventoryTile";
import { useInventory } from "@/hooks/useInventory"
import { useNavigate } from "react-router-dom";

export const Catalog = () => {

    const { data: inventory, isLoading: inventoryIsLoading } = useInventory();

    const navigate = useNavigate();

    return (
        <div className='w-full px-7'>
            <div className='sticky top-0 pt-7 bg-card z-10'>
                <h1 className='text-2xl text-accent-foreground mb-4'>Product Catalog</h1>
            </div>

            <div className='grid grid-cols-4 gap-4 p-2'>
                {inventoryIsLoading
                    ? Array.from({length: 16}).map((_, i) => <LoadingInventoryTile key={i} /> )
                    : inventory?.map((inventory) => (
                        <InventoryTile key={inventory.sku} item={inventory} onClick={() => navigate(`/catalog/${inventory.sku}`)} />
                    ))
                }
            </div>
        </div>
    )
}