import type { Inventory } from "@/types"
import type React from "react"
import { Badge } from "./ui/badge"
import { GENDER_COLORS, STATUS_COLORS, type Gender, type GenderColor, type StatusColor } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"

type InventoryTileProps = {
    item: Inventory;
    onClick: () => void
}

const InventoryTile = ({item, onClick}: InventoryTileProps): React.ReactNode => {
    const statusColor: StatusColor = item?.status && item.status in STATUS_COLORS ?
            STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] : 
            "bg-gray-500";
    const genderColor: GenderColor = item?.gender && item.gender in GENDER_COLORS ?
            GENDER_COLORS[item.gender as Gender] :
            "bg-gray-500";
    return (
        <div
            onClick={onClick}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') onClick(); }}
            className='flex flex-col gap-2 rounded-lg border-2 p-4 transition-all duration-200 shadow hover:scale-105 hover:bg-gray-700 hover:cursor-pointer'
        >
            <div className="flex flex-row gap-2 items-center justify-between">
                <Badge className={cn(genderColor, "self-left")}>{item.gender?.substring(0,1).toUpperCase()}</Badge>
                <Badge className={cn(statusColor, "self-right")}>{item.status}</Badge>
            </div>
            <div className="flex flex-row gap-3">
                <img className="rounded-sm max-w-1/3 self-center" src={item?.thumbnailPath} />
                <div className="flex flex-col">
                    <span className="text-sm">{item.shortDescription}</span>
                    <span className="text-sm text-muted-foreground">{item?.categoryName}</span>
                    <span className="text-sm text-muted-foreground">{item?.subCategoryName}</span>
                    <span className="text-sm text-muted-foreground">{`Size: ${item?.size}`}</span>
                </div>
            </div>
        </div>
    )
}

const LoadingInventoryTile = () => {
    return (
        <div className='flex flex-col gap-2 rounded-lg border-2 p-4 shadow'>
            <div className="flex flex-row gap-2">
                <Skeleton className="w-8 h-5 rounded-full" />
                <Skeleton className="w-16 h-5 rounded-full" />
            </div>
            <div className="flex flex-row gap-3">
                <Skeleton className="rounded-sm w-1/3 h-24 self-center shrink-0" />
                <div className="flex flex-col gap-1 justify-center">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </div>
        </div>
    )
}

export { LoadingInventoryTile };
export default InventoryTile;