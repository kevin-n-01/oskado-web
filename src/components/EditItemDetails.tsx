import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import type { Inventory } from "@/types";

type EditItemDetailsProps = {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    item: Inventory;
}

export const EditItemDetails = ({open, onOpenChange, item}: EditItemDetailsProps): ReactNode => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                Test
            </DialogContent>
        </Dialog>
    )
}