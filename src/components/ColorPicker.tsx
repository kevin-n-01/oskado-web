import { useState } from "react";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "./ui/combobox"
import type { Color } from "@/types";
import { cn } from "@/lib/utils";

type ColorPickerProps = {
    colors: Color[] | undefined,
    onValueChange: (colors: Color[]) => void
}
const ColorPicker = ({colors, onValueChange}: ColorPickerProps) => {

    const [ selectedColors, setSelectedColors] = useState<Color[]>([]);

    const anchor = useComboboxAnchor();

    return (
        <Combobox 
            multiple 
            autoHighlight 
            value={selectedColors} 
            onValueChange={(colors) => {
                setSelectedColors(colors)
                onValueChange(colors)
            }}
            items={colors}
            itemToStringLabel={(color) => color.colorName}
            itemToStringValue={(color) => String(color.id)}
            isItemEqualToValue={(item , value) => item.id === value.id}
        >
            <ComboboxChips ref={anchor} className='w-full max-w-2xl'>
                <ComboboxValue>
                    {selectedColors.map((color) => (
                        <ComboboxChip key={color.id} className="animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-1">
                                <div className='w-2 h-2 rounded-full' style={{backgroundColor: color.hexCode}} />
                                <span>{color.colorName}</span>
                            </div>
                        </ComboboxChip>
                    ))}
                </ComboboxValue>
                <ComboboxChipsInput placeholder="Add Colors" />
            </ComboboxChips>
            <ComboboxContent anchor={anchor} className='w-80 z-'>
                <ComboboxEmpty>No Additional Colors</ComboboxEmpty>
                <ComboboxList className='grid grid-cols-3'>
                    {(item: Color) => {
                        const isSelected = selectedColors.some((c) => c.id === item.id);
                        const baseSwatchClass = 'w-3 h-3 rounded-full';
                        return (
                            <ComboboxItem key={item.id} value={item} className='items-center'>
                                <div className="flex items-center gap-2">
                                    <div 
                                        className={cn(baseSwatchClass, isSelected && 'ring-2 ring-offset-1 ring-offset-background ring-muted-foreground zoom-in-95 transition-all duration-200')} 
                                        style={{backgroundColor: item.hexCode}}
                                    />
                                    <span>{item.colorName}</span>
                                </div>
                            </ComboboxItem>
                    )}}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}

export default ColorPicker;