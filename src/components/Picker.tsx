import React, { useState, type ReactNode } from "react"
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "./ui/combobox"

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
}

const Picker = <T,>({items, values, placeholder, onValueChange, itemToStringLabel, itemToStringValue, isItemEqualToValue, renderChip, renderListItem, container}: PickerProps<T>): React.ReactNode => {
    const anchor = useComboboxAnchor();
    const [selectedValues, setSelectedValues] = useState<T[]>(values ?? []);
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
                <ComboboxChipsInput placeholder={placeholder} />
            </ComboboxChips>
            <ComboboxContent anchor={anchor} className='w-80' container={container}>
                <ComboboxEmpty>No Additonal Values</ComboboxEmpty>
                <ComboboxList className='grid grid-cols-3'>
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