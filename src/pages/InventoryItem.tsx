import { EditItemDetails } from "@/components/EditItemDetails";
import ItemBreadCrumb from "@/components/ItemBreadCrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryItem } from "@/hooks/useInventory";
import { STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useParams } from "react-router-dom"

const SummaryRow = ({property, label}: {property: string | undefined; label: string | undefined} ) => {
    return (
        <div className="flex flex-row gap-2">
            <span className="text-muted-foreground text-sm">{label}:</span>
            <span className="text-foreground">{property}</span>
        </div>
    )
}

export const InventoryItem = (): React.ReactNode => {
    const params = useParams();
    const sku = params.sku;
    const { data: item } = useInventoryItem(sku!)

    const [showEditItemDetails, setShowItemDetails] = useState<boolean>(false);
    return (
        <div className='w-full h-full'>
            <Card className='w-full h-full p-7'>
                <ItemBreadCrumb item={item} />
                <CardHeader>
                    <div className="flex flex-row gap-6 items-center">
                        <CardTitle className='text-2xl text-accent-foreground'>{item?.shortDescription}</CardTitle>
                        <Badge className={cn(STATUS_COLORS[item?.status ?? ''])}>{item?.status}</Badge>
                    </div>
                    <CardDescription>{[item?.sku, item?.boxId ? `Box ${item.boxId}` : null].filter(Boolean).join(' | ')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row gap-6">
                        <img className="rounded-2xl max-w-1/3" src={item?.imagePath ?? undefined} />
                        <Separator orientation="vertical" />
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col gap-2 transition-color duration:200">
                                <Button onClick={() => setShowItemDetails(true)}>Edit Details</Button>
                                <Button>Mark Item as Listed</Button>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <SummaryRow property={item?.categoryName} label="Category" />
                                <SummaryRow property={item?.subCategoryName} label="Sub-Category" />
                                <SummaryRow property={item?.brandName as string | undefined} label="Brand" />
                                <SummaryRow property={item?.size as string | undefined} label="Size" />
                                <SummaryRow property={item?.gender} label="Gender" />
                                <SummaryRow property={item?.condition ?? "Unknown"} label="Condition" />
                            </div>
                        </div>

                    </div>
                    <div className="pt-4">
                        <Tabs defaultValue="description" className="w-96">
                            <TabsList variant="line">
                                <TabsTrigger value="description">Item Description</TabsTrigger>
                                <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
                                <TabsTrigger value="status_history">Status History</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
            {/* Edit Item Dialog */}
            <EditItemDetails open={showEditItemDetails} onOpenChange={setShowItemDetails} item={item} />
        </div>
       
    )
}
