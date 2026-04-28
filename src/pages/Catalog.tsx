import InventoryTile from "@/components/InventoryTile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInventory } from "@/hooks/useInventory"
import { useNavigate } from "react-router-dom";

export const Catalog = () => {

    const { data: inventory } = useInventory();

    const navigate = useNavigate();

    return (
        <Card className='w-full h-full p-7'>
            <CardHeader>
                <CardTitle className='text-2xl text-accent-foreground'>Product Catalog</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-4 gap-4'>
                    {inventory?.map((inventory) => (
                        <InventoryTile key={inventory.sku} item={inventory} onClick={() => navigate(`/catalog/${inventory.sku}`)} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}