
import OptionSelector from "../components/OptionSelector";
import { useRef, useState } from "react"
import type { Color, InventoryForm, LocationForm} from "@/types";
import { NewLocationDialog } from "@/components/NewLocationDialog";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddBrand, useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import { useAddSubcategory, useSubCategories } from "@/hooks/useSubCategories";
import { useColors } from "@/hooks/useColors";
import ColorPicker from "@/components/ColorPicker";
import { useAddLocation, useLocations } from "@/hooks/useLocations";
import { useAddSize, useSizes } from "@/hooks/useSizes";
import ConfirmItemDialog from "@/components/ConfirmItemDialog";
import { cn } from "@/lib/utils";



export const AddItem = () => {



    // Any needed form consts
    const genderMap = ["Female", "Male", "Unisex"];

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

    // ---- Sizes ------------------------------

    const { data: sizes } = useSizes();
    const { mutateAsync: addSize, isPending: addSizeIsPending } = useAddSize();
    const [chosenSizeId, setChosenSizeId] = useState<number>();

    const handleChosenSize = (size: string | null): void => {
        const chosenId = sizes?.find((s) => s.size === size)?.id;
        setChosenSizeId(chosenId);
    }

    const handleAddNewSize = async (size: string): Promise<void> => {
        const newSize = await addSize(size);
        setChosenSizeId(newSize.id);
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

    const handleChosenCategory = (value: string) => {
        setChosenCategoryId(Number(value));
        setValue('categoryId', Number(value), {shouldValidate: true});
    }

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

    const { data: locations } = useLocations();
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState<boolean>(false);
    const [chosenLocationId, setChosenLocationId] = useState<number>(0);
    const {mutateAsync: addLocation } = useAddLocation();

    const handleLocationAdded =  async (location: LocationForm): Promise<void> => {
        const newLocation = await addLocation(location);
        setChosenLocationId(newLocation.id);
    }

    const handleChosenLocation = (locationName: string | null): void => {
        const chosenLocation = locations?.find((l) => l.businessName === locationName)?.id
        setChosenLocationId(chosenLocation ?? 0);
    }

    //Upload Image Handler
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | undefined>();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file) return; 
        console.log(file.name);
        setImageFile(file);

    }

        // ---- Initialize React Hook Table & Submit Functions --------------------
    const { register, handleSubmit, control, setValue, formState: { errors }, reset } = useForm<InventoryForm>(
        {defaultValues: {
            gender: "Female",
        }}
    );

    const handleResetForm = () => {
        reset();
        setChosenBrandId(undefined);
        setChosenSizeId(undefined);
        setChosenColorIds(undefined);
        setChosenCategoryId(null);
        setChosenSubCategoryId(0);
        setChosenLocationId(0);
        setPurchaseDate(undefined);
        setImageFile(undefined);
    }

    const [confirmDialogIsOpen, setConfirmDialogIsOpen] = useState<boolean>(false);
    const [submittedInventory, setSubmittedInventory] = useState<InventoryForm | undefined>();

    

    const onSubmit: SubmitHandler<InventoryForm> = async (data: InventoryForm) => {
        const inventoryData = {
            ...data,
            categoryId: chosenCategoryId ?? 0,
            subCategoryId: chosenSubCategoryId ?? 0,
            brandId: chosenBrandId ?? 0,
            colorIds: chosenColorIds ?? [],
            sizeId: chosenSizeId,
            locationId: chosenLocationId,
            datePurchased: purchaseDate ?? new Date()
        };
        setSubmittedInventory(inventoryData);
        setConfirmDialogIsOpen(true);
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
                                <FieldLabel htmlFor="shortDescription">Item Description</FieldLabel>
                                <FieldDescription>Add a short description that will serve as the product name</FieldDescription>
                                <Textarea {...register('shortDescription')}
                                    id="shortDescription"
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
                                        rules={{required: true}}
                                        render={({field}) => {
                                            return (
                                                <Select value={field.value ? String(field.value) : ''} onValueChange={(value) => {
                                                    field.onChange(value);
                                                    handleChosenCategory(value)}}
                                                >
                                                    <SelectTrigger className={cn('w-full', errors.categoryId && 'border-destructive')}>
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
                                        loading={isLoadingSubCategories}
                                        disabled={!chosenCategoryId || chosenCategoryId === 0 || isLoadingSubCategories}
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldGroup className="grid grid-cols-5 gap-2">
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
                                    <Field>
                                        <FieldLabel>Size</FieldLabel>
                                        <OptionSelector
                                            listName="size"
                                            items={sizes}
                                            idKey="id"
                                            labelKey="size"
                                            handleChosenItem={handleChosenSize}
                                            handleAddNew={handleAddNewSize}
                                            addNewPending={addSizeIsPending}
                                            />
                                    </Field>
                                    <div className='flex items-end h-full pb-2'>
                                        <Field orientation="horizontal">
                                            <Checkbox id="isChild" defaultChecked {...register("isChild")} />
                                            <FieldLabel htmlFor="isChild">Children's?</FieldLabel>
                                        </Field>
                                    </div>

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
                                            labelKey="businessName"
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
                                            <InputGroupInput {...register("purchasePrice")}
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
                                <Button className="w-1/3 max-w-36" type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
                                <input
                                    className="hidden" 
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                />
                                {imageFile && <span className="text-muted-foreground text-sm">{imageFile.name}</span>}
                            </div>
                        </FieldSet>
                        <FieldSet>
                            <FieldGroup className="flex flex-row justify-end gap-2">
                                <Button variant="secondary">Cancel</Button>
                                <Button type="submit">
                                        Submit
                                </Button>
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
         {/*Conditionally Render New Location Dialog*/}
         <NewLocationDialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen} onLocationAdded={handleLocationAdded}/>

         {/* <ConfirmItemDialog open={confirmDialogIsOpen} inventory={submittedInventory!} /> */}
         <ConfirmItemDialog open={confirmDialogIsOpen} onOpenChange={setConfirmDialogIsOpen} inventory={submittedInventory} image={imageFile} onSaveForLater={handleResetForm} />
    </div>
    )
}