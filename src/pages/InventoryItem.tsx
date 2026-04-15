import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryItem } from "@/hooks/useInventory";
import { STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom"

export const InventoryItem = (): React.ReactNode => {
    const params = useParams();
    const sku = params.sku;
    const { data: item } = useInventoryItem(sku!)
    console.log(item);

    const cardDescription: string[] = [];
    if(item?.sku) {
        cardDescription.push(`SKU: ${item.sku}`);
    }
    if(item?.categoryName) {
        cardDescription.push(item.categoryName);
    }
    if(item?.brandName) {
        cardDescription.push(item.brandName);
    }

    return (
        <Card className='w-full h-full p-7'>
            <CardContent className="flex flex-col">

                <div className="flex flex-row gap-1">
                    <img className="rounded-2xl max-w-96" src={item?.imagePath} />
                    <CardHeader className='flex-1'>
                        <div className="flex flex-row gap-6 justify-baseline items-center">
                            <CardTitle className='text-2xl text-accent-foreground'>{item?.shortDescription}</CardTitle> 
                            <Badge className={cn(STATUS_COLORS[item?.status ?? ''])}>{item?.status}</Badge>
                        </div>
                        <CardDescription>{cardDescription.join(' | ')}</CardDescription>
                    </CardHeader>
                </div>
                

            </CardContent>
        </Card>
    )
}