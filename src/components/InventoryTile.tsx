import type { Inventory } from "@/types"
import type React from "react"
import { Badge } from "./ui/badge"
import { STATUS_COLORS, type StatusColor } from "@/lib/constants"
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
    return (
        <div 
            onClick={onClick}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') onClick(); }}
            className='relative flex flex-row gap-3 rounded-lg border-2 p-4 transition-all duration-200 shadow hover:scale-105 hover:bg-gray-700 hover:cursor-pointer'
        >
            <img className="rounded-sm max-w-1/3 self-center" src={item?.thumbnailPath} />
            <Badge className={cn(statusColor, 'absolute top-2 right-2')}>{item.status}</Badge>
            <div className="flex flex-col pr-16">
                <span className="text-sm">{item.shortDescription}</span>
                <span className="text-sm text-muted-foreground">{item?.categoryName}</span>
                <span className="text-sm text-muted-foreground">{item?.subCategoryName}</span>
                <span className="text-sm text-muted-foreground">{`Size: ${item?.size}`}</span>
            </div>
        </div>
    )
}

const LoadingInventoryTile = () => {
    return (
        <div className='relative flex flex-row gap-3 rounded-lg border-2 p-4 shadow'>
            <Skeleton className="rounded-sm w-1/3 h-24 self-center shrink-0" />
            <Skeleton className="absolute top-2 right-2 w-16 h-5 rounded-full" />
            <div className="flex flex-col gap-1 pr-16 justify-center">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </div>
    )
}

export { LoadingInventoryTile };
export default InventoryTile;