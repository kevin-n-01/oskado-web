import { type StoreLocation } from "./types"

declare global {
    interface Window {
        api: {
            brands: {
                getBrands: () => Promise<{id: number; brand_name: string}[]>
                addBrand: (brand_name: string) => Promise<{id: number; brand_name: string}>                
            }
            colors: {
                getColors: () => Promise<{id: number; color_name: string}[]>
                addColor: (color_name: string) => Promise<{id: number; color_name: string}>
            }
            fabrics: {
                getFabrics: () => Promise<{id: number; fabric_name: string}[]>
                addFabric: (fabric_name: string) => Promise<{id: number; fabric_name: string}>
            }
            locations: {
                getLocations: () => Promise<StoreLocation[]>
                addLocation: (business_name: string, business_short_name: string, description: string | null, street_address: string | null, city: string | null, state: string | null, img: string | null) => 
                    Promise<{id: number; business_name: string; short_name: string; description: string; street_address: string; city: string; state: string | null; image_path: string | null }>
            },
            files: {
                selectImage: () => Promise<string | null>
            },
            categories: {
                getCategories: () => Promise<{id: number; category_name: string; category_short_name: string}[]>
                getSubCategories: (category_id: number) => Promise<{id: number; category_id: number; sub_category_name: string}[]>
                addSubCategory: (category_id: number, sub_category_name: string) => Promise<{id: number, sub_category_name: string}>
            }
        }
    }
}

export {};