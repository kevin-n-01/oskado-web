import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Input } from "./ui/input";

export type DropDownOption = {
    id: number;
    value: string;
}
export type ColumnDef =
    | { key: string; label: string; type: "text" }
    | { key: string; label: string; type: "number"; min?: number; max?: number }
    | { key: string; label: string; type: "dropdown" }
    | { key: string; label: string; type: "combobox"; renderCombobox: (onChange: (key: string, value: string) => void ) => React.ReactNode }

type RowData = Record<string, string | number> & {_id: number};

const Selector = ({options, onChange}: {options: DropDownOption[]; onChange: (value: string) => void}): React.ReactNode => {
    return (
        <Select onValueChange={(val) => onChange(val)}>
            <SelectTrigger>
                <SelectValue placeholder="Select an Item" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem key={option.id} id={String(option.id)} value={option.value}>{option.value}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

type TableSelectorProps = {
    columns: ColumnDef[];
    optionsMap?: Record<string, DropDownOption[]>
}

export const TableSelector = ({columns, optionsMap}: TableSelectorProps) => {

    const [ rowList, setRowList ] = useState<RowData[]>(() => {
        const firstRow = { _id: 0 } as RowData;
        columns.forEach((column) => { firstRow[column.key] = "";})
        return [firstRow];
    });
    const nextId = useRef(0);

    const handleAddRow = () => {
        const newRow: RowData = {_id: nextId.current++};
        columns.forEach((column) => {
            newRow[column.key] = "";
        })
        setRowList((prev) => [...prev, newRow]);
    }

    const handleRemoveRow = (index: number) => {
        setRowList((prev) => prev.filter((_, i) => i !== index));
    }

    const handleCellChange = (rowIndex: number, key: string, value: string) => {
        setRowList((prev) => prev.map((row, i) =>
            i === rowIndex ? {...row, [key]: value } : row
        ))
    }

    const renderCell = (
        col: ColumnDef, 
        onChange: (key: string, value: string) => void,
        options: DropDownOption[]
    ) => {
        console.log(col.type);
        switch(col.type) {
            case "dropdown":
                return <Selector options={options} onChange={(val) => onChange(col.key, val)} />
            case "number":
                return <Input className="max-w-24" type="number" min={col.min} max={col.max} onChange={(e) => onChange(col.key, e.target.value)} />
            case "text":
                return <Input type="text" onChange={(e) => onChange(col.key, e.target.value)} />
            case "combobox":
                return col.renderCombobox((key, value) => onChange(key, value))
        }
    }



    return (
        <div className="flex flex-col w-fit">
            <Table className='mb-2 w-fit'>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.key}>{column.label}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rowList.map((row, i) => (
                        <TableRow key={row._id}>
                            {columns.map((column) => (
                                <TableCell key={column.key}>
                                    {renderCell(column,(key, value) => handleCellChange(i, key, value), optionsMap?.[column.key] ?? [])}
                                </TableCell>
                            ))}
                            <TableCell><Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveRow(i)}><X /></Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-end mr-0">
               <Button className='gap-1' type="button" size="sm" variant="secondary" onClick={() => handleAddRow()}><Plus /><span>Add Row</span></Button>
            </div>
        </div>
        
    )
};