import { type Brand, type Category, type Size, type SubCategory, type Color, type Location } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type Dispatch, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAddInventory } from "@/hooks/useInventory";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useUpload } from "@/hooks/useUploads";
import { useNavigate } from "react-router-dom";
import type { AddItemForm } from "@/pages/AddItem.schema";

type ConfirmItemDialogProps = {
    open: boolean;
    onOpenChange: Dispatch<React.SetStateAction<boolean>>;
    inventory: AddItemForm | undefined;
    image: File | undefined;
    onSaveForLater?: () => void;
    onAddMoreDetails?: () => void;
}

type SummaryRowProps = {
    item: string | undefined;
    label: string;
}

const SummaryRow = ({item, label}: SummaryRowProps) => {
    return (
        <>
            <span className="text-muted-foreground text-sm">{label}:</span>
            <span className="text-foreground">{item}</span>
        </>
    )
}

const ConfirmItemDialog = ({ open, onOpenChange, inventory, image, onSaveForLater }: ConfirmItemDialogProps): ReactNode => {

    const navigate = useNavigate();

    const [submittedItem, setSubmittedItem] = useState<string | undefined>();

    const {mutateAsync: addInventory, isPending: addInvIsPending, isSuccess: addInvIsSuccess, reset, } = useAddInventory();
    const { mutateAsync: upload, isPending: uploadIsPending } = useUpload();
    const qc = useQueryClient();
    // Get text values for all saved id values from inventory item
    const categoryName = qc.getQueryData<Category[]>(['categories'])?.find((c) => c.id === inventory?.categoryId)?.categoryName ?? "Unknown Category";
    const subCategoryName = qc.getQueryData<SubCategory[]>(['subCategories'])?.find((s) => s.id === inventory?.subCategoryId)?.subCategoryName ?? "Unknown Sub-Category";
    const brandName = qc.getQueryData<Brand[]>(['brands'])?.find((b) => b.id === inventory?.brandId)?.brandName ?? "Unknown Brand";
    const colors = qc.getQueryData<Color[]>(['colors'])?.filter((c) => inventory?.colorIds?.includes(c.id))?.map((c) => c.colorName)?.toSorted(( a , b) => a.localeCompare(b)).join(', ');
    const locationName = qc.getQueryData<Location[]>(['locations'])?.find((c) => inventory?.locationId === c.id)?.businessName ?? "Unknown Location";
    let sizeName = qc.getQueryData<Size[]>(['sizes'])?.find((s) => s.id === inventory?.sizeId)?.size || 'Unknown Size';
    sizeName = inventory?.isChild ? `Children's ${sizeName}` : `Adult's ${sizeName}`;

    const handleAddItem = async (inventory: AddItemForm): Promise<{sku: string}> => {
        let imagePath: string | undefined;
        let thumbnailPath: string | undefined;
        if(image) {
            const result = await upload(image);
            imagePath = result.data.imgPath;
            thumbnailPath = result.data.thumbnailPath;
        }
        const newItem: {sku: string} = await addInventory({...inventory, imagePath, thumbnailPath});
        setSubmittedItem(newItem.sku);
        return newItem;
    }
    const handleSubmitAnotherItem = () => {
        reset();
        onOpenChange(false);
        onSaveForLater?.();
    }

    const handleAddMoreDetails = async (inventory: AddItemForm) => {
        const newItem = await handleAddItem(inventory);
        navigate(`/catalog/${newItem.sku}`, {state: {openDetails: true}});
    }

    

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Item Summary
                    </DialogTitle>
                    <DialogDescription>
                        Please review item description
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center">
                    <SummaryRow item={inventory?.shortDescription} label="Item Description" />
                    <SummaryRow item={categoryName} label="Category" />
                    <SummaryRow item={subCategoryName} label="Sub-Category" />
                    <SummaryRow item={brandName} label="Brand" />
                    <SummaryRow item={colors} label="Colors" />
                    <SummaryRow item={inventory?.gender} label="Gender" />
                    <SummaryRow item={sizeName} label="Size" />
                </div>
                <Separator></Separator>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center">
                    <SummaryRow item={locationName} label="Location" />
                    <SummaryRow item={`$${inventory?.purchasePrice ?? "0.00"}`} label="Purchase Price" />
                    <SummaryRow item={inventory?.datePurchased?.toLocaleDateString()} label="Purchase Date" />
                    <SummaryRow item={image?.name} label="Uploaded Image" />
                </div>
                <div className="flex flex-row pt-3 justify-end gap-2">
                    <Button type="button" variant="secondary" disabled={!inventory || uploadIsPending || addInvIsPending} onClick={() => onOpenChange(false)}>Make Changes</Button>
                    <Button type="button" variant="default" disabled={!inventory || uploadIsPending || addInvIsPending} onClick={() => handleAddItem(inventory!)}>
                        {uploadIsPending || addInvIsPending ?
                            <><Loader2 className='animate-spin'/><span className='text-muted-foreground'>Saving...</span></> :
                           <span>Save For Later</span>
                        }
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        disabled={!inventory || uploadIsPending || addInvIsPending}
                        onClick={() => handleAddMoreDetails(inventory!)}
                    >Add More Details</Button>
                </div>
                <Dialog open={addInvIsSuccess}>
                    <DialogContent className="w-64">
                        <DialogHeader>
                            <DialogTitle>Item Created!</DialogTitle>
                            <DialogDescription>SKU: {submittedItem} </DialogDescription>
                            <DialogDescription>Would you like to add another item?</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-row gap-2 justify-end">
                            <Button className='min-w-15' onClick={() => handleSubmitAnotherItem()}>Yes</Button>
                            <Button variant="secondary" className='min-w-15'>No</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </DialogContent>

        </Dialog>
    )
}

export default ConfirmItemDialog;