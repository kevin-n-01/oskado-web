import { Button } from "@/components/ui/button";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Loader2, PlusSquare } from "lucide-react";
import { useState, type ReactNode } from "react";

export type OptionSelectionProps<T> = {
    listName: string;
    items: T[] | undefined;
    itemToStringLabel: (item: T) => string;
    itemToStringValue: (item: T) => string;
    isItemEqualToValue: (a: T, b: T) => boolean;
    usesDialog?: boolean;
    handleChosenItem: (item: T | null) => void;
    handleAddNew?: (inputValue: string) => Promise<void>;
    addNewPending?: boolean;
    onOpenDialog?: () => void;
    renderItem?: (item: T) => ReactNode;
    loading?: boolean;
    hideAddNew?: boolean;
    disabled?: boolean;
    container?: HTMLElement;
}

const OptionSelector = <T,>({ listName, items, itemToStringLabel, itemToStringValue, isItemEqualToValue, usesDialog, handleChosenItem, handleAddNew, addNewPending, onOpenDialog, renderItem, loading, hideAddNew, disabled, container }: OptionSelectionProps<T>) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<T | null>(null);

    return (
        <Combobox
            disabled={disabled}
            items={items}
            value={selectedValue}
            onValueChange={(item: T | null) => {
                setSelectedValue(item);
                handleChosenItem(item);
            }}
            itemToStringLabel={itemToStringLabel}
            itemToStringValue={itemToStringValue}
            isItemEqualToValue={isItemEqualToValue}
            autoHighlight
        >
            <ComboboxInput
                placeholder={loading ? 'Loading...' : `Select a ${listName}...`}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={disabled}
            />
            <ComboboxContent container={container}>
                {!usesDialog && !hideAddNew && (
                    <ComboboxEmpty>
                        <Button size="default" disabled={addNewPending} className="w-full justify-start" variant="ghost" onClick={() => handleAddNew?.(inputValue)}>
                            {addNewPending ?
                                <><Loader2 className="animate-spin" />{`Adding ${inputValue}...`}</> :
                                <><PlusSquare />{`Add ${inputValue}`}</>
                            }
                        </Button>
                    </ComboboxEmpty>
                )}
                {usesDialog && !hideAddNew && (
                    <Button size="default" variant="ghost" onClick={() => onOpenDialog?.()}>
                        <PlusSquare />
                        {`Add new ${listName}`}
                    </Button>
                )}
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={itemToStringValue(item)} value={item}>
                            {renderItem ? renderItem(item) : itemToStringLabel(item)}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
};

export default OptionSelector;
