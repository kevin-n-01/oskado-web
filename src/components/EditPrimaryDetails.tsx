import React, { useState, useRef } from "react";
import { type Inventory, type InventoryForm, type LocationForm } from "@/types";
import { type Control, type UseFormRegister, Controller } from "react-hook-form";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "./ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CalendarIcon, ChevronDown, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useBrands, useAddBrand } from "@/hooks/useBrands";
import { useSizes, useAddSize } from "@/hooks/useSizes";
import { useColors } from "@/hooks/useColors";
import { useSubCategories, useAddSubcategory } from "@/hooks/useSubCategories";
import { useLocations, useAddLocation } from "@/hooks/useLocations";
import ColorPicker from "./ColorPicker";
import { NewLocationDialog } from "./NewLocationDialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./ui/input-group";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import OptionSelector from "./OptionSelector";
import { type Color } from "@/types";

export type EditPrimaryDetailsProps = {
    register: UseFormRegister<InventoryForm>;
    control: Control<InventoryForm>;
    item: Inventory;
    onBrandChange: (id: number | undefined) => void;
    onSizeChange: (id: number | undefined) => void;
    onColorChange: (ids: number[]) => void;
    onSubCategoryChange: (id: number) => void;
    onLocationChange: (id: number) => void;
    onDateChange: (date: Date | undefined) => void;
    onImageChange: (file: File | undefined) => void;
    purchaseDate: Date | undefined;
    imageFile: File | undefined;
}

const genderMap = ["Female", "Male", "Unisex"];

export const EditPrimaryDetails = ({
    register, control, item,
    onBrandChange, onSizeChange, onColorChange, onSubCategoryChange,
    onLocationChange, onDateChange, onImageChange,
    purchaseDate, imageFile,
}: EditPrimaryDetailsProps): React.ReactNode => {

    const [open, setOpen] = useState(false);
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: brands } = useBrands();
    const { mutateAsync: addBrand, isPending: addBrandIsPending } = useAddBrand();
    const { data: sizes } = useSizes();
    const { mutateAsync: addSize, isPending: addSizeIsPending } = useAddSize();
    const { data: colors } = useColors();
    const { data: subCategories, isLoading: isLoadingSubCategories } = useSubCategories(item.categoryId ?? null);
    const { mutateAsync: addSubcategory, isPending: addSubCategoryIsPending } = useAddSubcategory();
    const { data: locations } = useLocations();
    const { mutateAsync: addLocation } = useAddLocation();

    const handleAddNewBrand = async (name: string): Promise<void> => {
        const newBrand = await addBrand(name);
        onBrandChange(newBrand.id);
    }

    const handleAddNewSize = async (size: string): Promise<void> => {
        const newSize = await addSize(size);
        onSizeChange(newSize.id);
    }

    const handleAddNewSubCategory = async (subCategoryName: string): Promise<void> => {
        if (!item.categoryId) return;
        const newSub = await addSubcategory({ categoryId: item.categoryId, subCategoryName });
        onSubCategoryChange(newSub.id);
    }

    const handleLocationAdded = async (location: LocationForm): Promise<void> => {
        const newLocation = await addLocation(location);
        onLocationChange(newLocation.id);
    }

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
                <Button type="button" variant="ghost" className="flex items-center gap-2 px-0 text-muted-foreground">
                    <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                    Edit Primary Details?
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <FieldGroup className="pt-2">
                    <FieldSet>
                        <Field className="max-w-1/2">
                            <FieldLabel htmlFor="shortDescription">Item Description</FieldLabel>
                            <Textarea
                                {...register('shortDescription')}
                                id="shortDescription"
                                placeholder="White Hanes T-Shirt"
                            />
                        </Field>
                        <FieldGroup className="grid grid-cols-2 gap-2">
                            <Field>
                                <FieldLabel>Sub-Category</FieldLabel>
                                <OptionSelector
                                    listName="sub-category"
                                    items={subCategories}
                                    idKey="id"
                                    labelKey="subCategoryName"
                                    handleChosenItem={(name) => {
                                        const id = subCategories?.find(s => s.subCategoryName === name)?.id;
                                        onSubCategoryChange(id ?? 0);
                                    }}
                                    handleAddNew={handleAddNewSubCategory}
                                    addNewPending={addSubCategoryIsPending}
                                    loading={isLoadingSubCategories}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Brand</FieldLabel>
                                <OptionSelector
                                    listName="brand"
                                    items={brands}
                                    idKey="id"
                                    labelKey="brandName"
                                    handleChosenItem={(name) => {
                                        const id = brands?.find(b => b.brandName === name)?.id;
                                        onBrandChange(id);
                                    }}
                                    handleAddNew={handleAddNewBrand}
                                    addNewPending={addBrandIsPending}
                                />
                            </Field>
                        </FieldGroup>
                        <FieldGroup className="grid grid-cols-4 gap-2">
                            <Field>
                                <FieldLabel>Color</FieldLabel>
                                <ColorPicker
                                    colors={colors}
                                    onValueChange={(colors: Color[]) => onColorChange(colors.map(c => c.id))}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Gender</FieldLabel>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {genderMap.map((g) => (
                                                        <SelectItem key={g} value={g}>{g}</SelectItem>
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
                                    handleChosenItem={(size) => {
                                        const id = sizes?.find(s => s.size === size)?.id;
                                        onSizeChange(id);
                                    }}
                                    handleAddNew={handleAddNewSize}
                                    addNewPending={addSizeIsPending}
                                />
                            </Field>
                            <div className="flex items-end h-full pb-2">
                                <Field orientation="horizontal">
                                    <Checkbox id="isChild" {...register("isChild")} />
                                    <FieldLabel htmlFor="isChild">Children's?</FieldLabel>
                                </Field>
                            </div>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend>Purchase Information</FieldLegend>
                        <FieldGroup className="grid grid-cols-3 gap-2">
                            <Field>
                                <FieldLabel>Purchase Location</FieldLabel>
                                <OptionSelector
                                    listName="location"
                                    items={locations}
                                    idKey="id"
                                    labelKey="businessName"
                                    handleChosenItem={(name) => {
                                        const id = locations?.find(l => l.businessName === name)?.id;
                                        onLocationChange(id ?? 0);
                                    }}
                                    onOpenDialog={() => setIsLocationDialogOpen(true)}
                                    usesDialog
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="purchasePrice">Purchase Price</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText>$</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        {...register("purchasePrice")}
                                        id="purchasePrice"
                                        placeholder="0.00"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>USD</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel>Purchase Date</FieldLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            data-empty={!purchaseDate}
                                            className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                                        >
                                            <CalendarIcon />
                                            {purchaseDate ? format(purchaseDate, 'MM/dd/yyyy') : <span>Select a Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={purchaseDate} onSelect={onDateChange} />
                                    </PopoverContent>
                                </Popover>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend>Product Photo</FieldLegend>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="secondary" className="w-1/3 max-w-36" onClick={() => fileInputRef.current?.click()}>
                                Upload Image
                            </Button>
                            <input
                                className="hidden"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => onImageChange(e.target.files?.[0])}
                            />
                            {imageFile && (
                                <>
                                    <span className="text-muted-foreground text-sm">{imageFile.name}</span>
                                    <Button variant="ghost" type="button" onClick={() => {
                                        onImageChange(undefined);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}>
                                        <X />
                                    </Button>
                                </>
                            )}
                        </div>
                    </FieldSet>
                </FieldGroup>
            </CollapsibleContent>
            <NewLocationDialog
                open={isLocationDialogOpen}
                onOpenChange={setIsLocationDialogOpen}
                onLocationAdded={handleLocationAdded}
            />
        </Collapsible>
    )
}
