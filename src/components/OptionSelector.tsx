import { Button } from "@/components/ui/button";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { PlusSquare } from "lucide-react";
import { useState, type ReactNode } from "react";

interface OptionSelectionProps<T> {
    listName: string,
    items: T[] | undefined;
    labelKey: keyof T;
    idKey: keyof T;
    usesDialog?: boolean;
    handleChosenItem: (item_name: string | null) => void;
    handleAddNew?: (inputValue: string) => Promise<void>;
    onOpenDialog?: () => void;
    renderItem?: (item: T) => ReactNode;
    hideAddNew?: boolean
    disabled?: boolean
}
const OptionSelector = <T,>({listName, items, labelKey, idKey, usesDialog, handleChosenItem, handleAddNew, onOpenDialog, renderItem, hideAddNew, disabled}: OptionSelectionProps<T>) => {
    console.log("Testing dialog switch for ", listName, usesDialog, handleAddNew);
    const [inputValue, setInputValue] = useState<string>('');

    return (
     <Combobox disabled={disabled} items={items} onValueChange={handleChosenItem} autoHighlight>
            <ComboboxInput 
                className="cursor-pointer! focus:cursor-text!"
                placeholder={`Select a ${listName}...`}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={disabled}
            />
            <ComboboxContent >
                {!usesDialog && !hideAddNew && (
                <ComboboxEmpty>
                    <Button size="default" className="w-full justify-start" variant="ghost" onClick={() => usesDialog ? onOpenDialog?.() : handleAddNew?.(inputValue)}>
                        <PlusSquare />
                        {`Add ${inputValue}...`}
                    </Button>
                </ComboboxEmpty>)}
                {usesDialog && !hideAddNew && (
                    <Button size="default" variant="ghost" onClick={() => usesDialog ? onOpenDialog?.() : handleAddNew?.(inputValue)}>
                        <PlusSquare />
                        {`Add new ${listName}`}
                    </Button>
                )}
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item[idKey] as number} value={item[labelKey] as string}>
                            {renderItem ? renderItem(item) : item[labelKey] as string}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}

export default OptionSelector;