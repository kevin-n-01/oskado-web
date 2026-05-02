
import OptionSelector from "../components/OptionSelector";
import { useRef, useState } from "react"
import type { Brand, Color, Location, Size, SubCategory, InventoryForm} from "@/types";
import { NewLocationDialog } from "@/components/NewLocationDialog";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X} from "lucide-react";
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

    const genderMap = ["Female", "Male", "Unisex"];

    const { register, handleSubmit, control, setValue, watch, formState: { errors }, reset } = useForm<InventoryForm>(
        { defaultValues: { gender: "Female" } }
    );

    const categoryId = watch('categoryId');
    const datePurchased = watch('datePurchased');

    // ---- Brands ------------------------------

    const { data: brands } = useBrands();
    const { mutateAsync: addBrand, isPending: addBrandisPending } = useAddBrand();

    const handleAddNewBrand = async (brand: string): Promise<void> => {
        const newBrand = await addBrand(brand);
        setValue('brandId', newBrand.id);
    }

    // ---- Sizes ------------------------------

    const { data: sizes } = useSizes();
    const { mutateAsync: addSize, isPending: addSizeIsPending } = useAddSize();

    const handleAddNewSize = async (size: string): Promise<void> => {
        const newSize = await addSize(size);
        setValue('sizeId', newSize.id);
    }

    // ---- Colors ------------------------------

    const { data: colors } = useColors();

    const handleChosenColors = (colors: Color[]) => {
        setValue('colorIds', colors.map((c) => c.id));
    }

    // ---- Categories -----------

    const { data: categories } = useCategories();

    const { data: subCategories, isLoading: isLoadingSubCategories } = useSubCategories(categoryId ?? null);
    const { mutateAsync: addNewSubcategory, isPending: addSubCategoryIsPending } = useAddSubcategory();

    const handleAddNewSubCategory = async (subCategoryName: string): Promise<void> => {
        if (!categoryId) return;
        const newSubCategory = await addNewSubcategory({ categoryId, subCategoryName });
        setValue('subCategoryId', newSubCategory.id);
    }

    // ---- Locations -----------------------

    const { data: locations } = useLocations();
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState<boolean>(false);
    const { mutateAsync: addLocation } = useAddLocation();

    const handleLocationAdded = async (location: Parameters<typeof addLocation>[0]): Promise<void> => {
        const newLocation = await addLocation(location);
        setValue('locationId', newLocation.id);
    }

    // ---- Image Upload ------------------------------

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | undefined>();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImageFile(file);
    }

    // ---- Form Submit & Reset --------------------

    const handleResetForm = () => {
        reset();
        setImageFile(undefined);
    }

    const [confirmDialogIsOpen, setConfirmDialogIsOpen] = useState<boolean>(false);
    const [submittedInventory, setSubmittedInventory] = useState<InventoryForm | undefined>();

    const onSubmit: SubmitHandler<InventoryForm> = async (data: InventoryForm) => {
        setSubmittedInventory(data);
        setConfirmDialogIsOpen(true);
    }


    return (
    <div className="w-full mx-auto px-6">
        <div className="sticky top-0 pt-6 bg-card z-10">
            <h1 className="text-2xl text-accent-foreground mb-4">Add New Item</h1>
        </div>
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
                                                <Select value={field.value ? String(field.value) : ''} onValueChange={(value) => field.onChange(Number(value))}>
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
                                    <OptionSelector<SubCategory>
                                        listName="sub-category"
                                        items={subCategories}
                                        itemToStringLabel={(s) => s.subCategoryName}
                                        itemToStringValue={(s) => String(s.id)}
                                        isItemEqualToValue={(a, b) => a.id === b.id}
                                        handleChosenItem={(s) => setValue('subCategoryId', s?.id ?? 0)}
                                        handleAddNew={handleAddNewSubCategory}
                                        addNewPending={addSubCategoryIsPending}
                                        loading={isLoadingSubCategories}
                                        disabled={!categoryId || isLoadingSubCategories}
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldGroup className="grid grid-cols-5 gap-2">
                                <Field>
                                    <FieldLabel>Brand</FieldLabel>
                                    <OptionSelector<Brand>
                                        listName="brand"
                                        items={brands}
                                        itemToStringLabel={(b) => b.brandName}
                                        itemToStringValue={(b) => String(b.id)}
                                        isItemEqualToValue={(a, b) => a.id === b.id}
                                        handleChosenItem={(b) => setValue('brandId', b?.id)}
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
                                        <OptionSelector<Size>
                                            listName="size"
                                            items={sizes}
                                            itemToStringLabel={(s) => s.size}
                                            itemToStringValue={(s) => String(s.id)}
                                            isItemEqualToValue={(a, b) => a.id === b.id}
                                            handleChosenItem={(s) => setValue('sizeId', s?.id)}
                                            handleAddNew={handleAddNewSize}
                                            addNewPending={addSizeIsPending}
                                        />
                                    </Field>
                                    <div className='flex items-end h-full pb-2'>
                                        <Field orientation="horizontal">
                                            <Checkbox id="isChild" {...register("isChild")} />
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
                                        <OptionSelector<Location>
                                            listName="location"
                                            items={locations}
                                            itemToStringLabel={(l) => l.businessName}
                                            itemToStringValue={(l) => String(l.id)}
                                            isItemEqualToValue={(a, b) => a.id === b.id}
                                            onOpenDialog={() => setIsLocationDialogOpen(true)}
                                            handleChosenItem={(l) => setValue('locationId', l?.id ?? 0)}
                                            usesDialog
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
                                                data-empty={!datePurchased}
                                                className="w-70 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                                            >
                                                <CalendarIcon />
                                                {datePurchased ? format(datePurchased, 'MM/dd/yyyy') : <span>Select a Date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" captionLayout="dropdown" selected={datePurchased} onSelect={(date) => setValue('datePurchased', date)} />
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
                                {imageFile &&
                                <>
                                    <span className="text-muted-foreground text-sm">{imageFile.name}</span>
                                    <Button variant="ghost" onClick={ ()=> {
                                        setImageFile(undefined);
                                        if(fileInputRef.current) fileInputRef.current.value = '';
                                    }}>
                                        {<X />}
                                    </Button>
                                </>
                                }
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
         <NewLocationDialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen} onLocationAdded={handleLocationAdded}/>
         <ConfirmItemDialog open={confirmDialogIsOpen} onOpenChange={setConfirmDialogIsOpen} inventory={submittedInventory} image={imageFile} onSaveForLater={handleResetForm} />
    </div>
    )
}
