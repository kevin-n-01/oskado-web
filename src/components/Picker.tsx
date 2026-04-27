import React, { Fragment, useState, type ReactNode } from "react"
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "./ui/combobox"
import { Button } from "./ui/button";
import { Loader2, PlusSquare } from "lucide-react";

type PickerProps<T> = {
    items: T[] | undefined;
    values: T[] | undefined;
    placeholder: string;
    onValueChange: (items: T[]) => void;
    itemToStringLabel: (item: T) => string;
    itemToStringValue: (item: T) => string;
    isItemEqualToValue: (a: T, b: T) => boolean;
    renderChip: (item: T) => ReactNode;
    renderListItem: (item: T, isSelected?: boolean) => ReactNode;
    container?: HTMLElement | null;
    handleAddNew?: (inputValue: string) => Promise<void>;
    addNewPending?: boolean;
    listClassName?: string;
}

const Picker = <T,>({items, values, placeholder, onValueChange, itemToStringLabel, itemToStringValue, isItemEqualToValue, renderChip, renderListItem, container, handleAddNew, addNewPending, listClassName}: PickerProps<T>): React.ReactNode => {
    const anchor = useComboboxAnchor();
    const [selectedValues, setSelectedValues] = useState<T[]>(values ?? []);
    const [inputValue, setInputValue] = useState<string>('');
    return (
        <Combobox
            multiple
            autoHighlight
            value={selectedValues}
            onValueChange={(newValues) => {
                setSelectedValues(newValues);
                onValueChange(newValues);
            }}
            items={items}
            itemToStringLabel={itemToStringLabel}
            itemToStringValue={itemToStringValue}
            isItemEqualToValue={isItemEqualToValue}
        >
            <ComboboxChips ref={anchor} className='w-full max-w-2xl'>
                <ComboboxValue>
                    {selectedValues && selectedValues.map((value) => (
                        <ComboboxChip key={itemToStringValue(value)} className="animate-in fade-in zoom-in-95 duration-200">
                            {renderChip(value)}
                        </ComboboxChip>
                    ))}
                </ComboboxValue>
                <ComboboxChipsInput 
                    placeholder={placeholder}
                    {...(handleAddNew && {onChange: (e) => setInputValue(e.target.value)})}
                />
            </ComboboxChips>
            <ComboboxContent anchor={anchor} className='w-80' container={container}>
                <ComboboxEmpty>
                    {handleAddNew ? (
                        <Button size="sm" type="button" disabled={addNewPending} className='w-full justify-start' variant="ghost" onClick={() => handleAddNew?.(inputValue)}>
                            {addNewPending ?
                                <Fragment><Loader2 className='animate-spin' />{`Adding ${inputValue}...`}</Fragment> :
                                <Fragment><PlusSquare />{`Add ${inputValue}`}</Fragment>
                            }
                        </Button>
                    ):
                    <span className='text-sm text-muted-foreground'>No Additional Values</span>
                    }

                </ComboboxEmpty>
                <ComboboxList className={listClassName ?? 'grid grid-cols-3'}>
                   {(item: T) => {
                    const isSelected = selectedValues?.some((v) => isItemEqualToValue(v, item));
                    return (
                        <ComboboxItem key={itemToStringValue(item)} value={item}>
                            {renderListItem(item, isSelected ?? false)}
                        </ComboboxItem>
                    )
                   }}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}

export default Picker;