import { EditItemDetails } from "@/components/EditItemDetails";
import ItemBreadCrumb from "@/components/ItemBreadCrumb";
import InventoryItemDesc from "@/components/InventoryItemDesc";
import MarkItemListed from "@/components/MarkItemListed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryItem } from "@/hooks/useInventory";
import { STATUS_COLORS, type Status, type StatusColor } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton";

const SummaryRow = ({property, label}: {property: string | undefined; label: string | undefined} ) => {
    return (
        <>
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="text-sm">{property ?? '—'}</span>
        </>
    )
}

export const InventoryItem = (): React.ReactNode => {
    // Collect state passthrough from Add Item Dialog if user is transported direclty here
    const location = useLocation();
    const openDetails = location?.state?.openDetails ?? false;

    const params = useParams();
    const sku = params.sku;
    const { data: item, isLoading: inventoryIsLoading } = useInventoryItem(sku!)

    const statusColor: StatusColor = item?.status && item.status in STATUS_COLORS ?
        STATUS_COLORS[item.status as Status] : 
        "bg-gray-500";

    const [showEditItemDetails, setShowItemDetails] = useState<boolean>(openDetails);
    const [ showMarkItemListed, setShowMarkItemListed ] = useState<boolean>(false);

    const showMarkItemListedButton = item?.status === "Inventoried" as Status;
    const showMarkItemSoldButton = item?.status === "Listed" as Status;

    return (
        <div className='w-full px-7'>
            <div className='sticky top-0 pt-7 bg-card z-10'>
                <ItemBreadCrumb item={item} isLoading={inventoryIsLoading} />
                <div className="pt-4 pb-2">
                    {inventoryIsLoading ? (
                        <div className="flex flex-row gap-4 items-center">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                    ) : (
                        <div className="flex flex-row gap-6 items-center">
                            <h1 className='text-2xl text-accent-foreground'>{item?.shortDescription}</h1>
                            <Badge className={cn(statusColor)}>{item?.status}</Badge>
                        </div>
                    )}
                    {inventoryIsLoading
                        ? <Skeleton className="h-4 w-32 mt-1" />
                        : <CardDescription>{[item?.sku, item?.boxId ? `Box ${item.boxId}` : null].filter(Boolean).join(' | ')}</CardDescription>
                    }
                </div>
            </div>
                <div>
                    <div className="flex flex-row gap-6 my-6">
                        {inventoryIsLoading
                            ? <Skeleton className="rounded-2xl w-1/3 h-80 self-start shrink-0" />
                            : <img className="rounded-2xl max-w-1/3 object-cover self-start" src={item?.imagePath ?? undefined} />
                        }
                        <Separator orientation="vertical" />
                        <div className="flex flex-col gap-4 flex-1 min-w-0">
                            {inventoryIsLoading ? (
                                <>
                                    <div className="flex flex-row gap-2">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-8 w-36" />
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-3 items-baseline">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <>
                                                <Skeleton key={`label-${i}`} className="h-4 w-24" />
                                                <Skeleton key={`value-${i}`} className="h-4 w-32" />
                                            </>
                                        ))}
                                    </div>
                                    <Separator />
                                    <div className="flex flex-row gap-4">
                                        <Skeleton className="h-8 w-28" />
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-8 w-32" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-row gap-2">
                                        <Button size="sm" onClick={() => setShowItemDetails(true)}>Edit Details</Button>
                                        {showMarkItemListedButton && <Button size="sm" onClick={() => setShowMarkItemListed(true)}>Mark Item as Listed</Button>}
                                        {showMarkItemSoldButton && <Button size="sm">Mark Item as Sold</Button>}
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2 items-baseline">
                                        <SummaryRow property={item?.categoryName} label="Category" />
                                        <SummaryRow property={item?.subCategoryName} label="Sub-Category" />
                                        <SummaryRow property={item?.brandName as string | undefined} label="Brand" />
                                        <SummaryRow property={item?.size as string | undefined} label="Size" />
                                        <SummaryRow property={item?.gender} label="Gender" />
                                        <SummaryRow property={item?.condition ?? "—"} label="Condition" />
                                        {item?.conditionDescription && <SummaryRow property={item?.conditionDescription} label="Addl Info" />}
                                    </div>
                                    <Separator />
                                    <Tabs defaultValue="description">
                                        <TabsList variant="line">
                                            <TabsTrigger value="description">Item Description</TabsTrigger>
                                            <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
                                            <TabsTrigger value="status_history">Status History</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="description"><InventoryItemDesc item={item} /></TabsContent>
                                    </Tabs>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            {/* Edit Item Dialog */}
            {showEditItemDetails && item && <EditItemDetails open={showEditItemDetails} onOpenChange={setShowItemDetails} item={item} />}
            {showMarkItemListed && item && <MarkItemListed open={showMarkItemListed} onOpenChange={setShowMarkItemListed} item={item} />}
        </div>
    )
}
