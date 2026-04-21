import React, { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useCallback } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { type Inventory, type Measurement, type Season, type Tag } from "@/types";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import Picker from "./Picker";
import { useSeasons } from "@/hooks/useSeasons";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "./ui/field";
import { useAddTag, useTags } from "@/hooks/useTags";
import Hashtag from "./Hashtag";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import {TableSelector, type ColumnDef, type DropDownOption} from "./TableSelector";
import { useFabrics } from "@/hooks/useFabrics";
import { useAddMeasurement, useMeasurements } from "@/hooks/useMeasurements";
import { Key } from "lucide-react";
import OptionSelector from "./OptionSelector";


type EditItemDetailsProps = {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    item: Inventory;
}

const CONDITION_LIST = ["Poor", "Fair", "Good", "Like New", "New With Tags"];


type MeasurementComboboxProps = {
    measurements: Measurement[] | undefined;
    addMeasurement: (name: string) => Promise<Measurement>;
    addMeasurementIsPending: boolean;
    onChange: (key: string, value: string) => void;
    container?: HTMLElement | null;
}
const MeasurementCombobox = ({measurements, addMeasurement, addMeasurementIsPending, onChange, container}: MeasurementComboboxProps): React.ReactNode => {
        return (
            <OptionSelector
                listName='Measurement'
                items={measurements}
                labelKey="measurementName"
                idKey="id"
                handleChosenItem={(value) => onChange("measurement", value ?? '')}
                handleAddNew={async (name) => {await addMeasurement(name); } }
                addNewPending={addMeasurementIsPending}
                container={container ?? undefined}
            />
        )
    }

export const EditItemDetails = ({open, onOpenChange, item}: EditItemDetailsProps): ReactNode => {
    
    // React Hook Table
    const {handleSubmit, register, control} = useForm<Inventory>();

    const onSubmit: SubmitHandler<Inventory> = async (data: Inventory) => {

    }

    // Portal container — captures the dialog DOM node so Base UI portal renders inside it
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const containerRef = useCallback((node: HTMLDivElement | null) => setContainer(node), []);

    // Seasons
    const {data: seasons, isLoading: seasonsIsLoading } = useSeasons();
    const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);

    //Tags
    const { data: tags, isLoading: tagsIsLoading } = useTags();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const { mutateAsync: addTag, isPending: addTagIsPending } = useAddTag();

    const handleAddNewTag = async (tagText: string): Promise<void> => {
        await addTag(tagText);
    }

    // Conditition
    const [chosenCondition, setChosenCondition] = useState<string>('');

    // Fabrics
    const {data: fabrics} = useFabrics();
    const fabricOptions: Record<string, DropDownOption[]> = {};
    fabricOptions["fabric"] = fabrics?.map((fabric): DropDownOption => ({id: fabric.id, value: fabric.fabricName})) ?? [];
    const fabricColumns: ColumnDef[] = [
        {key: "fabric", label: "Fabric", type: "dropdown"},
        {key: "percentage", label: "%", type: "number", min: 0, max: 100}
    ]

    //Measurements
    const { data: measurements } = useMeasurements();
    const {mutateAsync: addMeasurement, isPending: addMeasurementIsPending} = useAddMeasurement();
    const measurementOptions: Record<string, DropDownOption[]> = {};
    measurementOptions['measurement'] = measurements?.map((m): DropDownOption => ({id: m.id, value: m.measurementName})) ?? [];
    measurementOptions['unit'] = [{id: 1, value: "cm"}, {id: 2, value: "in"}]
    const measurementColumns: ColumnDef[] = [
        {key: "measurement", label: "Measurement", type: "combobox", renderCombobox: (onChange) => <MeasurementCombobox onChange={onChange} measurements={measurements} addMeasurement={addMeasurement} addMeasurementIsPending={addMeasurementIsPending} container={container} />},
        {key: "value", label: "Value", type: "number"},
        {key: "unit", label: "Unit", type:"dropdown"}
    ]

    
    // const fabricOptionsMap: Record<string, DropdownOption[]> = 
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="max-w-2xl max-h-[80vh]">
                <div ref={containerRef} />
                <DialogHeader className="text-xl">Edit Item Details</DialogHeader>
                <form className="overflow-y-auto overflow-x-hidden max-h-[calc(80vh-8rem)] pr-4" id='edit-item-details' onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <FieldSet>
                                <Field className='max-w-80'>
                                    <FieldLabel>Seasons</FieldLabel>
                                        <Picker
                                            container={container}
                                            items={seasons}
                                            values={selectedSeasons}
                                            placeholder={seasonsIsLoading ? "Loading..." : "Select Seasons"}
                                            onValueChange={(seasons) => {
                                                console.log(seasons)
                                                setSelectedSeasons(seasons)}
                                            }
                                            itemToStringLabel={(season) => String(season.seasonName)}
                                            itemToStringValue={(season) => String(season.id)}
                                            isItemEqualToValue={(item, value) => item.id === value.id}
                                            renderChip={(item) => <>{item.seasonName}</>}
                                            renderListItem={(item) => <>{item.seasonName}</>}
                                        />
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
                                        render={({field}) => {
                                            return (
                                                <Select
                                                    value={field.value ? String(field.value) : ''}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        console.log("Chosen Condition ", value)
                                                        setChosenCondition(value);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full max-w-64">
                                                        <SelectValue placeholder="Select a Condition" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Conditions</SelectLabel>
                                                            {CONDITION_LIST.map((c) => (
                                                                <SelectItem key={c} id={c} value={c}>{c}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            )
                                        }}
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
                                    <TableSelector columns={fabricColumns} optionsMap={fabricOptions} />
                                </Field>
                                <Field className='w-fit'>
                                    <FieldLabel>Measurements</FieldLabel>
                                    <TableSelector columns={measurementColumns} optionsMap={measurementOptions} />
                                </Field>
                            </FieldSet>
                        </FieldGroup>
                </form>
                
                
            </DialogContent>
        </Dialog>           
    )
}