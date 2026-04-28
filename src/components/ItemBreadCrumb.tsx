import type { Inventory } from "@/types"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb"
import { Link } from "react-router-dom";


const ItemBreadCrumb = ({ item }: {item: Inventory | undefined}) => {
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