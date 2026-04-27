import type { Inventory } from "@/types"
import type React from "react"
import { Badge } from "./ui/badge"
import { STATUS_COLORS, type StatusColor } from "@/lib/constants"
import { cn } from "@/lib/utils"

type InventoryTileProps = {
    item: Inventory
}

const InventoryTile = ({item}: InventoryTileProps): React.ReactNode => {
    const statusColor: StatusColor = item?.status && item.status in STATUS_COLORS ?
            STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] : 
            "bg-gray-500";
    return (
        <div className='relative flex flex-row gap-3 rounded-lg border-2 p-4 transition-all duration-200 shadow hover:scale-105 hover:border-accent-foreground hover:cursor-pointer'>
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

export default InventoryTile;