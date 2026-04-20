import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";

type DropDownOption = {
    id: number;
    value: string;
}
export type ColumnDef =
    | { key: string; label: string; type: "text" }
    | { key: string; label: string; type: "number"; min?: number; max?: number }
    | { key: string; label: string; type: "dropdown"; options: DropDownOption[] }

type RowData = Record<string, string | number>;

const Selector = ({options, onChange}: {options: DropDownOption[]; onChange: (value: string) => void}): React.ReactNode => {
    return (
        <Select onValueChange={(val) => onChange(val)}>
            <SelectTrigger>
                <SelectValue placeholder="Select a Fabric" />
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

    

    const [ rowList, setRowList ] = useState<RowData[]>([]);

    const handleAddRow = () => {
        const newRow: RowData = {};
        columns.forEach((column) => {
            newRow[column.key] = "";
        })
        setRowList((prev) => [...prev, newRow]);
    }

    const handleCellChange = (rowIndex: number, key: string, value: string) => {
        setRowList((prev) => prev.map((row, i) =>
            i === rowIndex ? {...row, [key]: value } : row
        ))
    }

    const renderCell = (
        col: ColumnDef, 
        onChange: (key: string, value: string) => void
    ) => {
        switch(col.type) {
            case "dropdown":
                return <Selector options={col.options} onChange={(val) => onChange(col.key, val)} />
            case "number":
                return <Input type="number" min={col.min} max={col.max} onChange={(e) => onChange(col.key, e.target.value)} />
            case "text":
                return <Input type="text" onChange={(e) => onChange(col.key, e.target.value)} />
        }
    }



    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {fabricColumns.map((column) => (
                            <TableHead key={column.key}>{column.label}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rowList.map((_, i) => (
                        <TableRow key={i}>
                            {fabricColumns.map((column) => (
                                <TableCell key={column.key}>
                                    {renderCell(column,(key, value) => handleCellChange(i, key, value))}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button type="button" variant="secondary" onClick={() => handleAddRow()}><Plus /></Button>
        </div>
        
    )
};