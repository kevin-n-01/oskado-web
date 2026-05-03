import type { Inventory } from "@/types"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb"
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";


const ItemBreadCrumb = ({ item, isLoading }: {item: Inventory | undefined; isLoading?: boolean}) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link to="/catalog">Catalog</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                {isLoading ? <Skeleton className="h-4 w-20" /> : <BreadcrumbLink href="#">{item?.categoryName}</BreadcrumbLink>}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                {isLoading ? <Skeleton className="h-4 w-24" /> : <BreadcrumbLink href="#">{item?.subCategoryName}</BreadcrumbLink>}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                {isLoading ? <Skeleton className="h-4 w-16" /> : <BreadcrumbLink href="#">{item?.brandName}</BreadcrumbLink>}
            </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default ItemBreadCrumb;