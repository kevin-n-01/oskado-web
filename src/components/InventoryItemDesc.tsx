import type { Inventory } from "@/types";
import type React from "react";
import { Hash } from "lucide-react";

type InventoryItemProps = {
    item: Inventory | undefined;
}

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{children}</h3>
)

const InventoryItemDesc = ({ item }: InventoryItemProps): React.ReactNode => {
    return (
        <div className="flex flex-col gap-6 pt-4">

            {item?.colors && item.colors.length > 0 && (
                <div>
                    <SectionHeader>Colors</SectionHeader>
                    <div className="flex flex-row flex-wrap gap-2">
                        {item.colors.map((color) => (
                            <div key={color.colorName} className="rounded-md border flex flex-row px-2 py-1 gap-2 items-center shadow">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color.hexcode }} />
                                <span className="text-sm">{color.colorName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-row gap-10">
                {item?.measurements && item.measurements.length > 0 && (
                    <div>
                        <SectionHeader>Measurements</SectionHeader>
                        <ul className="flex flex-col gap-1">
                            {item.measurements.map((m, i) => (
                                <li key={i} className="text-sm">
                                    {m.measurementName} <span className="text-muted-foreground">{m.measurementValue} {m.measurementUnit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {item?.fabrics && item.fabrics.length > 0 && (
                    <div>
                        <SectionHeader>Fabric</SectionHeader>
                        <ul className="flex flex-col gap-1">
                            {item.fabrics.map((fabric) => (
                                <li key={fabric.fabricName} className="text-sm">
                                    {fabric.fabricName} <span className="text-muted-foreground">{fabric.percentage}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex flex-row gap-10">
                {item?.seasons && item.seasons.length > 0 && (
                    <div>
                        <SectionHeader>Seasons</SectionHeader>
                        <div className="flex flex-row flex-wrap gap-2">
                            {item.seasons.map((season) => (
                                <div key={season} className="rounded-md border px-2 py-1 shadow">
                                    <span className="text-sm">{season}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {item?.tags && item.tags.length > 0 && (
                    <div>
                        <SectionHeader>Tags</SectionHeader>
                        <div className="flex flex-row flex-wrap gap-2">
                            {item.tags.map((tag) => (
                                <div key={tag} className="rounded-md border flex flex-row px-2 py-1 gap-1 items-center shadow">
                                    <Hash size={11} className="text-muted-foreground" />
                                    <span className="font-mono text-sm">{tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default InventoryItemDesc;
