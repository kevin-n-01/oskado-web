import type { Inventory } from "@/types";
import type React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Hash } from "lucide-react";

type InventoryItemProps = {
    item: Inventory | undefined;
}

const InventoryItemDesc = ({ item }: InventoryItemProps): React.ReactNode => {
    return (
        <div>
            <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                    <h3 className="text-lg font-bold">Fabric</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Fabric
                                </TableHead>
                                <TableHead>
                                    Percentage
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {item?.fabrics?.map((fabric) => (
                                <TableRow key={fabric.fabricName}>
                                    <TableCell>{fabric.fabricName}</TableCell>
                                    <TableCell>{fabric.percentage}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <h3 className="text-lg font-bold">Colors</h3>
                        <div className="flex flex-col gap-2">
                            {item?.colors?.map((color) => (
                                <div key={color.colorName} className="rounded-md border flex flex-row px-2 py-1 gap-2 items-center w-fit shadow">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: color.hexcode}} />
                                    <span>{color.colorName}</span>
                                </div>
                            ))}
                        </div>  
                </div>
               <div>
                <h3 className="text-lg font-bold">Tags</h3>
                <div className="flex flex-col-gap-2">
                    {item?.tags?.map((tag) => (
                        <div key={tag} className="rounded-md border flex flex-row px-2 py-1 gap-2 items-center w-fit shadow">
                            <Hash size={12} />
                            <span className="font-mono">{tag}</span>
                        </div>
                    ))}
                </div>
               </div>
            </div>
            <div>
                <h3 className="text-lg font-bold">Seasons</h3>
                <div className="flex flex-col gap-2">
                    {item?.seasons?.map((season) => (
                        <div key={season} className="rounded-md border flex flex-row px-2 py-1 gap-2 items-center w-fit shadow">
                            {season}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold">Measurements</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Measurement</TableHead>
                            <TableHead>Size</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}

export default InventoryItemDesc;