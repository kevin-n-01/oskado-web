import type { Inventory } from "@/types"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb"


const ItemBreadCrumb = ({ item }: {item: Inventory | undefined}) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink href="#">Catalog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbLink href="#">{item?.categoryName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbLink href="#">{item?.subCategoryName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbLink href="#">{item?.brandName}</BreadcrumbLink>
            </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default ItemBreadCrumb;