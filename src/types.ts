export type StoreLocation = {
  id: number;
  business_name: string;
  short_name: string;
  description: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  image_path: string | null;
};

export type ItemFormData = {
    brand_id: number;
    categoryId: number;
    gender: string;
    is_child: boolean;
    purchase_price: number;
    short_description: string;


}

export type Brand = {
    id: number;
    brandName: string
}

export type Category = {
    id: number;
    categoryName: string;
    categoryShortName: string;
}

export type SubCategory = {
    id: number;
    categoryId: number;
    subCategoryName: string;
}

export type Color = {
    id: number;
    colorName: string;
    hexCode: string;
}

export type Size = {
    id: number;
    size: string;
}

export type LocationForm = {
    businessName: string;
    shortName: string;
    description: string | undefined;
    streetAddress: string | undefined;
    city: string | undefined;
    state: string | undefined;
    imagePath: string | undefined;
    thumbnailPath: string | undefined;
}

export type Location = LocationForm & {
    id: number;
}


type InventoryBase = {
    shortDescription: string;
    brandId: number | undefined;
    categoryId: number;
    subCategoryId: number | undefined ;
    locationId: number;
    sizeId: number | undefined;
    purchasePrice: number;
    datePurchased: Date;
    gender: string;
    isChild: boolean;
    imagePath: string | undefined;
    thumbnailPath: string | undefined
}

export type InventoryForm = InventoryBase & {
    colorIds: number[];
}

export type Inventory = InventoryBase & {
    sku: string;
    brandName?: string | null;
    categoryName?: string;
    businessName?: string;
    listingPrice?: number | null;
    condition?: string | null;
    conditionDescription?: string | null;
    size?: string | null;
    boxId?: number | null;
    status?: string;
    colors?: { colorName: string; hexcode: string }[];
    fabrics?: { fabricName: string; percentage: number }[];
    seasons?: string[];
    tags?: string[];
    websites?: string[];
}