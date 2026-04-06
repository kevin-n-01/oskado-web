
import OptionSelector from "../components/OptionSelector";
import { useEffect, useState } from "react"
import type { Color, ItemFormData, LocationFormData, StoreLocation } from "@/types";
import { NewLocationDialog } from "@/components/NewLocationDialog";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddBrand, useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import { useAddSubcategory, useSubCategories } from "@/hooks/useSubCategories";
import { useColors } from "@/hooks/useColors";
import ColorPicker from "@/components/ColorPicker";



export const AddItem = () => {

    // Any needed form consts
    const genderMap = ["Female", "Male", "Unisex"];

    // Load selectable options from Dim Tables



    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState<boolean>(false);
    const [locations, setLocations]= useState<StoreLocation[]>([]);
    const [chosenLocationId, setChosenLocationId] = useState<number>(0);

    //const [categories, setCategories] = useState<{id: number, category_name: string}[]>([]);


    // Input fields not managed by RHT
    const [purchaseDate, setPurchaseDate] = useState<Date | undefined>();



    // ---- Brands ------------------------------

    const {data: brands } = useBrands();
    const {mutateAsync: addBrand, isPending: addBrandisPending } = useAddBrand();
    const [chosenBrandId, setChosenBrandId] = useState<number>();


    const handleChosenBrand = (brand: string | null): void => {
        const chosenId = brands?.find((b) => b.brandName=== brand)?.id;
        setChosenBrandId(chosenId);
        console.log("Chosen brand: ", chosenId, brand); 
    }

    const handleAddNewBrand = async (brand: string): Promise<void> => {
        const newBrand = await addBrand(brand);
        setChosenBrandId(newBrand.id);
        console.log("Brand Added: ", newBrand.brand_name)
    }

    //---Colors----------------------------

    const {data: colors} = useColors();
    const [chosenColorIds, setChosenColorIds] = useState<number[]>();

    const handleChosenColors = (colors: Color[]) => {
        const colorIds = colors.map((c) => c.id);
        setChosenColorIds(colorIds);
    }

    // ---- Categories -----------

    const { data: categories } = useCategories();
    const [chosenCategoryId, setChosenCategoryId] = useState<number | null>();

    const { data: subCategories, isLoading: isLoadingSubCategories } = useSubCategories(chosenCategoryId ?? null);
    const [chosenSubCategoryId, setChosenSubCategoryId] = useState<number>(0);
    const {mutateAsync: addNewSubcategory, isPending: addSubCategoryIsPending } = useAddSubcategory();

    const handleChosenSubCategory = (subCategoryName: string | null) => {
        const subCategoryId = subCategories?.find((c) => c.subCategoryName === subCategoryName)?.id;
        setChosenSubCategoryId(subCategoryId ?? 0);
    }

    const handleAddNewSubCategory = async (subCategoryName: string): Promise<void> => {
        if(!chosenCategoryId) return;
        const newSubCategory = await addNewSubcategory({ categoryId: chosenCategoryId, subCategoryName });
        setChosenSubCategoryId(newSubCategory.id);
    }

    // ---- Locations -----------------------
    const openLocationDialog = () => setIsLocationDialogOpen(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const locations = await window.api.locations.getLocations();
                setLocations(locations);
            } catch (error) {
                throw new Error(error instanceof Error ? error.message : "Unknown error while retrieving colors");
            }
        }
        fetchLocations();
    }, [])

    const handleChosenLocation = (location: string | null): void => {
        const id = locations.find((l) => l.business_name === location)?.id ?? 0;
        setChosenLocationId(id);
    }

    const handleLocationAdded = async (location: LocationFormData): Promise<void> => {
        const newLocation = await window.api.locations.addLocation(
            location.business_name,
            location.short_name,
            location.description ?? '',
            location.street_address ?? '',
            location.city ?? '',
            location.state ?? '',
            location.image_path ?? ''
        );
        setLocations((prev) => [...(prev), newLocation as StoreLocation])
        setChosenLocationId(newLocation.id)
    }

    //Upload Image Handler
    const [imgPath, setImgPath] = useState<string | null>();

    const handleUpload = async (): Promise<void> => {
        const newPath = await window.api.files.selectImage();
        setImgPath(newPath);
    }

    const getFileName = (path: string): string | undefined => {
        return path.split(/[\\/]/).pop()
    }

        // ---- Initialize React Hook Table & Submit Function --------------------
    const { register, handleSubmit, control } = useForm<ItemFormData>(
        {defaultValues: {
            gender: "Female",
        }}
    );

    const onSubmit: SubmitHandler<ItemFormData> = async (data: ItemFormData) => {
        console.log('submitted!', data);
    }


    return (
    <div>
        <Card className="w-3/4 bg-center p-6 m-5 mx-auto overflow-visible">
            <CardHeader className="text-2xl text-accent-foreground">Add New Item</CardHeader>

            <CardContent>
                <form id='add-new-item-form' onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend className='pb-2'>Product Information</FieldLegend>
                            <Field className="max-w-1/2">
                                <FieldLabel htmlFor="short_description">Item Description</FieldLabel>
                                <FieldDescription>Add a short description that will serve as the product name</FieldDescription>
                                <Textarea {...register('short_description')}
                                    id="short_description"
                                    placeholder="White Hanes T-Shirt"
                                    required
                                />
                            </Field>
                            <FieldGroup className="grid grid-cols-2 gap-2">
                                <Field>
                                    <FieldLabel>Category</FieldLabel>
                                    <Controller 
                                        name='categoryId'
                                        control={control}
                                        render={({field}) => {
                                            return (
                                                <Select value={field.value ? String(field.value) : ''} onValueChange={(value) => {
                                                    field.onChange(value);
                                                    setChosenCategoryId(Number(value))}}
                                                >
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select a category...' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {categories?.map((category) => (
                                                                <SelectItem key={category.id} value={String(category.id)}>
                                                                    {category.categoryName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            )
                                        }}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Sub-Category</FieldLabel>
                                    <OptionSelector
                                        listName="sub-category"
                                        items={subCategories}
                                        idKey="id"
                                        labelKey="subCategoryName"
                                        handleChosenItem={handleChosenSubCategory}
                                        handleAddNew={handleAddNewSubCategory}
                                        addNewPending={addSubCategoryIsPending}
                                        disabled={!chosenCategoryId || chosenCategoryId === 0 || isLoadingSubCategories}
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldGroup className="grid grid-cols-4 gap-2">
                                <Field>
                                    <FieldLabel>Brand</FieldLabel>
                                    <OptionSelector 
                                            listName="brand" 
                                            items={brands} 
                                            idKey="id" 
                                            labelKey="brandName" 
                                            handleChosenItem={handleChosenBrand} 
                                            handleAddNew={handleAddNewBrand}
                                            addNewPending={addBrandisPending}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Color</FieldLabel>
                                    <ColorPicker colors={colors} onValueChange={handleChosenColors}/>
                                </Field>
                                <Field>
                                    <FieldLabel>Gender</FieldLabel>
                                        <Controller
                                            name="gender"
                                            control={control}
                                            render={({field}) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full max-w-48">
                                                        <SelectValue placeholder="Female"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {genderMap.map((gender, i) => (
                                                                <SelectItem key={i} value={gender}>{gender}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                </Field>
                                <Field orientation="horizontal">
                                    <Checkbox id="isChild" defaultChecked {...register("is_child")} />
                                    <FieldLabel htmlFor="isChild">Is this children's clothing?</FieldLabel>
                                </Field>
                            </FieldGroup>
                            
                            
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend className='pb-2'>Purchase Information</FieldLegend>
                            <FieldGroup className="grid grid-cols-3">
                                <Field>
                                    <FieldLabel>Purchase Location</FieldLabel>
                                        <OptionSelector
                                            listName="location"
                                            items={locations}
                                            idKey="id"
                                            labelKey="business_name"
                                            onOpenDialog={openLocationDialog}
                                            handleChosenItem={handleChosenLocation}
                                            usesDialog
                                            // renderItem={(locations) => <StoreLocationDetails />}
                                        />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="purchasePrice">Purchase Price</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <InputGroupText>$</InputGroupText>
                                        </InputGroupAddon>
                                            <InputGroupInput {...register("purchase_price")}
                                                id="purchasePrice"
                                                placeholder="0.00"
                                            />
                                            <InputGroupAddon align="inline-end">
                                                <InputGroupText>USD</InputGroupText>
                                            </InputGroupAddon>
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="purchaseDate">Purchase Date</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                data-empty={!purchaseDate}
                                                className="w-70 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                                            >
                                                <CalendarIcon />
                                                {purchaseDate ? format(purchaseDate, 'MM/dd/yyyy') : <span>Select a Date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={purchaseDate} onSelect={setPurchaseDate} />
                                        </PopoverContent>
                                    </Popover>
                                </Field>
                            </FieldGroup>
                            
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend className='pb-2'>Add Product Photo</FieldLegend>
                            <div className="flex items-center gap-2 max-w-1/2">
                                <Button className="w-1/3 max-w-36" type="button" variant="secondary" onClick={handleUpload}>Upload Image</Button>
                                {imgPath && <span className="text-sm text-muted-foreground">{getFileName(imgPath)}</span>}
                            </div>
                        </FieldSet>
                        <FieldSet>
                            <FieldGroup className="flex flex-row justify-end gap-2">
                                <Button variant="secondary">Cancel</Button>
                                <Button>Submit Now</Button>
                                <Button>I'm Ready to List - Add All Details</Button>
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
         {/*Conditionally Render New Location Dialog*/}
         <NewLocationDialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen} onLocationAdded={handleLocationAdded}/>
        
    </div>
        

    )
}