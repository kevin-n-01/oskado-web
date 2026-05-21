import { Button } from "./ui/button";
import { type Inventory } from "@/types"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type MarkItemSoldProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: Inventory;
}
export const MarkItemSold = ({ open, onOpenChange, item }: MarkItemSoldProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">Mark Item as Sold</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mark Item as Sold</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to mark this item as sold?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange}>Cancel</Button>
                    <Button onClick={() => {
                        // Logic to mark the item as sold
                        onOpenChange(false);
                    }}>Mark as Sold</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};