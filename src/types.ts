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

export type LocationFormData = {
    business_name: string;
    short_name: string;
    description?: string;
    street_address?: string;
    city?: string;
    state?: string;
    image_path?: string | null;
}

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

export type Location = {
    id: number;
    businessName: string;
    shortName: string;
    description: string | undefined;
    streetAddress: string | undefined;
    city: string | undefined;
    state: string | undefined;
    imagePath: string | undefined;
}