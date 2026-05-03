import React, { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { type Inventory, type InventoryForm, type Measurement, type Season, type Tag } from "@/types";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import Picker from "./Picker";
import { useSeasons } from "@/hooks/useSeasons";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "./ui/field";
import { useAddTag, useTags } from "@/hooks/useTags";
import Hashtag from "./Hashtag";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { type RowData, TableSelector, type ColumnDef, type DropDownOption } from "./TableSelector";
import { useFabrics } from "@/hooks/useFabrics";
import { useAddMeasurement, useMeasurements } from "@/hooks/useMeasurements";
import OptionSelector from "./OptionSelector";
import { CONDITION_LIST, type ConditionList } from "@/lib/constants";
import { Button } from "./ui/button";
import { useUpdateInventory } from "@/hooks/useInventory";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { editItemDetails, type EditItemForm } from "./EditItemDetails.schema";
import FormFieldError from "./FormFieldError";
import { toast } from "sonner";
// import { EditPrimaryDetails } from "./EditPrimaryDetails";

type EditItemDetailsProps = {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    item: Inventory;
}

type MeasurementComboboxProps = {
    measurements: Measurement[] | undefined;
    addMeasurement: (name: string) => Promise<Measurement>;
    addMeasurementIsPending: boolean;
    onChange: (key: string, value: string) => void;
    container?: HTMLElement | null;
}

const MeasurementCombobox = ({ measurements, addMeasurement, addMeasurementIsPending, onChange, container }: MeasurementComboboxProps): React.ReactNode => {
    return (
        <OptionSelector
            listName='Measurement'
            items={measurements}
            itemToStringLabel={(m) => m.measurementName}
            itemToStringValue={(m) => String(m.id)}
            isItemEqualToValue={(a, b) => a.id === b.id}
            handleChosenItem={(m) => onChange("measurement", String(m?.id))}
            handleAddNew={async (name) => { await addMeasurement(name); }}
            addNewPending={addMeasurementIsPending}
            container={container ?? undefined}
        />
    )
}

export const EditItemDetails = ({ open, onOpenChange, item }: EditItemDetailsProps): ReactNode => {

    const { mutateAsync: updateInventory, isPending: updateInventoryPending } = useUpdateInventory(item?.sku);

    const { handleSubmit, register, control, setValue, formState: { errors } } = useForm<EditItemForm>({
        resolver: zodResolver(editItemDetails)
    });

    // Portal container
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const containerRef = useCallback((node: HTMLDivElement | null) => setContainer(node), []);

    // Seasons
    const { data: seasons, isLoading: seasonsIsLoading } = useSeasons();
    const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);

    // Tags
    const { data: tags, isLoading: tagsIsLoading } = useTags();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const { mutateAsync: addTag, isPending: addTagIsPending } = useAddTag();

    const handleAddNewTag = async (tagText: string): Promise<void> => {
        await addTag(tagText);
    }

    // Fabrics
    const [fabricRows, setFabricRows] = useState<RowData[]>([]);
    const { data: fabrics } = useFabrics();
    const fabricOptions: Record<string, DropDownOption[]> = {};
    fabricOptions["fabric"] = fabrics?.map((fabric): DropDownOption => ({ id: fabric.id, value: fabric.fabricName })) ?? [];
    const fabricColumns: ColumnDef[] = [
        { key: "fabric", label: "Fabric", type: "dropdown" },
        { key: "percentage", label: "%", type: "number", min: 0, max: 100 }
    ]

    const syncFabricRows = (rows: RowData[]) => {
        setFabricRows(rows);
        setValue('fabrics', rows.flatMap((row) => {
            const fabricId = fabrics?.find((f) => f.fabricName === row.fabric)?.id;
            if (!fabricId) return [];
            return [{ fabricId, percentage: Number(row.percentage) }];
        }));
    }

    // Measurements
    const [measurementRows, setMeasurementRows] = useState<RowData[]>([]);
    const { data: measurements } = useMeasurements();
    const { mutateAsync: addMeasurement, isPending: addMeasurementIsPending } = useAddMeasurement();
    const measurementOptions: Record<string, DropDownOption[]> = {};
    measurementOptions['measurement'] = measurements?.map((m): DropDownOption => ({ id: m.id, value: m.measurementName })) ?? [];
    measurementOptions['unit'] = [{ id: 1, value: "cm" }, { id: 2, value: "in" }]
    const measurementColumns: ColumnDef[] = [
        { key: "measurement", label: "Measurement", type: "combobox", renderCombobox: (onChange) => <MeasurementCombobox onChange={onChange} measurements={measurements} addMeasurement={addMeasurement} addMeasurementIsPending={addMeasurementIsPending} container={container} /> },
        { key: "value", label: "Value", type: "number" },
        { key: "unit", label: "Unit", type: "dropdown" }
    ]

    // Primary detail state — produced by EditPrimaryDetails, consumed in onSubmit
    // const [chosenBrandId, setChosenBrandId] = useState<number | undefined>(item?.brandId);
    // const [chosenSizeId, setChosenSizeId] = useState<number | undefined>(item?.sizeId);
    // const [chosenColorIds, setChosenColorIds] = useState<number[]>([]);
    // const [chosenSubCategoryId, setChosenSubCategoryId] = useState<number>(item?.subCategoryId ?? 0);
    // const [chosenLocationId, setChosenLocationId] = useState<number>(item?.locationId ?? 0);
    // const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(item?.datePurchased);
    // const [imageFile, setImageFile] = useState<File | undefined>();

    const onSubmit: SubmitHandler<InventoryForm> = async (data: InventoryForm) => {
        const payload = {
            ...data,
            // brandId: chosenBrandId,
            // sizeId: chosenSizeId,
            // colorIds: chosenColorIds,
            // subCategoryId: chosenSubCategoryId,
            // locationId: chosenLocationId,
            // datePurchased: purchaseDate,
            measurements: measurementRows.map((row) => ({ measurementId: Number(row.measurement), measurementValue: Number(row.value), measurementUnit: String(row.unit) })),
            fabrics: fabricRows.flatMap((row) => {
                const fabricId = fabrics?.find((f) => f.fabricName === row.fabric)?.id;
                if (!fabricId) return [];
                return [{ fabricId, percentage: Number(row.percentage) }]
            }),
            seasonIds: selectedSeasons.map((season) => season.id),
            tagIds: selectedTags.map((tag) => tag.id),
        }
        try {
            await updateInventory(payload);
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update inventory');
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogTitle><DialogHeader className='text-xl px-0'>Edit Item Details</DialogHeader></DialogTitle>
                <div ref={containerRef} />
                <form className="overflow-y-auto overflow-x-hidden max-h-[calc(80vh-8rem)] pr-4" id='edit-item-details' onSubmit={handleSubmit(onSubmit, () => toast.error("Please correct the indicated form errors"))}>
                    <FieldGroup>
                        <FieldSet>
                            <Field className='max-w-80'>
                                <FieldLabel>Seasons</FieldLabel>
                                <Picker
                                    container={container}
                                    items={seasons}
                                    values={selectedSeasons}
                                    placeholder={seasonsIsLoading ? "Loading..." : "Select Seasons"}
                                    onValueChange={(seasons) => setSelectedSeasons(seasons)}
                                    itemToStringLabel={(season) => String(season.seasonName)}
                                    itemToStringValue={(season) => String(season.id)}
                                    isItemEqualToValue={(item, value) => item.id === value.id}
                                    renderChip={(item) => <>{item.seasonName}</>}
                                    renderListItem={(item) => <>{item.seasonName}</>}
                                />
                                <FormFieldError error={errors?.seasons?.root} />
                            </Field>
                            <Field className='max-w-80'>
                                <FieldLabel>Tags</FieldLabel>
                                <Picker
                                    container={container}
                                    items={tags}
                                    values={selectedTags}
                                    placeholder={tagsIsLoading ? "Loading Tags" : "Select Tags"}
                                    onValueChange={(tags) => setSelectedTags(tags)}
                                    itemToStringLabel={(tag) => tag.tagText}
                                    itemToStringValue={(tag) => String(tag.id)}
                                    isItemEqualToValue={(item, value) => item.id === value.id}
                                    renderChip={(item) => <Hashtag tagText={item.tagText} iconSize={14} />}
                                    renderListItem={(item) => <Hashtag tagText={item.tagText} iconSize={20} />}
                                    handleAddNew={handleAddNewTag}
                                    addNewPending={addTagIsPending}
                                />
                            </Field>
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend>Item Condition</FieldLegend>
                            <Field>
                                <Controller
                                    name='condition'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ? String(field.value) : ''}
                                            onValueChange={(value) => field.onChange(value)}
                                        >
                                            <SelectTrigger className="w-full max-w-64">
                                                <SelectValue placeholder="Select a Condition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Conditions</SelectLabel>
                                                    {CONDITION_LIST.map((c: ConditionList) => (
                                                        <SelectItem key={c} id={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="conditionDescription">Enter any additional information on item condition</FieldLabel>
                                <Textarea
                                    {...register('conditionDescription')}
                                    id="conditionDescription"
                                    placeholder="Light wear on left sleeve"
                                />
                            </Field>
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <Field className='w-fit'>
                                <FieldLabel>Fabric Selection</FieldLabel>
                                <TableSelector columns={fabricColumns} optionsMap={fabricOptions} onRowsChange={syncFabricRows} />
                <FormFieldError error={errors.fabrics?.root ?? errors.fabrics} />
                                <FormFieldError error={errors.fabrics?.root} />
                            </Field>
                            <Field className='w-fit'>
                                <FieldLabel>Measurements</FieldLabel>
                                <TableSelector columns={measurementColumns} optionsMap={measurementOptions} onRowsChange={setMeasurementRows} />
                            </Field>
                        </FieldSet>
                        <FieldSeparator />
                        {/*<EditPrimaryDetails
                            register={register}
                            control={control}
                            item={item}
                            onBrandChange={setChosenBrandId}
                            onSizeChange={setChosenSizeId}
                            onColorChange={setChosenColorIds}
                            onSubCategoryChange={setChosenSubCategoryId}
                            onLocationChange={setChosenLocationId}
                            onDateChange={setPurchaseDate}
                            onImageChange={setImageFile}
                            purchaseDate={purchaseDate}
                            imageFile={imageFile}
                        /> */}
                    </FieldGroup>
                    <Button type="submit" disabled={updateInventoryPending} className="mt-4">
                        {updateInventoryPending ?
                            <><Loader2 className='animate-spin' /><span>Submitting</span></> :
                            <span>Update Item</span>
                        }
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
