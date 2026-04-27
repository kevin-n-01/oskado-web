import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Website, InventoryForm, Inventory } from "@/types";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useCallback, useState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { useWebsites } from "@/hooks/useWebsites";
import Picker from "./Picker";
import { useUpdateInventory } from "@/hooks/useInventory";

type MarkItemListedProps = {
    item: Inventory | undefined;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const MarkItemListed = ({open, item, onOpenChange}: MarkItemListedProps): React.ReactNode => {

    const {register, handleSubmit, reset } = useForm<InventoryForm>();
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const containerRef = useCallback((node: HTMLDivElement | null) => setContainer(node), []);

    const { data: websites, isLoading: websitesIsLoading } = useWebsites();
    const { mutateAsync: updateInventory, isPending: updateInventoryIsPending } = useUpdateInventory(item?.sku ?? '');

    const [ listingDate, setListingDate ] = useState<Date | undefined>();
    const [ selectedWebsites, setSelectedWebsites ] = useState<Website[]>([]);

    const handleCancel = () => {
        setListingDate(undefined);
        setSelectedWebsites([]);
        onOpenChange(false);
        reset();
    }

    const onSubmit: SubmitHandler<InventoryForm> = async (data: InventoryForm) => {
        const payload = {
            ...data,
            boxId: data.boxId || null,
            listingPrice: data.listingPrice || null,
            statusDate: listingDate,
            websiteIds: selectedWebsites.map((web) => web.id),
            status: "Listed",
            notes: `Item listed on ${selectedWebsites.map(web => web.websiteName).join(' ,')}`
        }

        await updateInventory(payload);
        setListingDate(undefined);
        setSelectedWebsites([]);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Listing Details</DialogTitle>
                </DialogHeader>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <FieldSet>
                                <Field  className='max-w-48'>
                                    <FieldLabel>Box Number</FieldLabel>
                                    <Input {...register("boxId")} type="number" min={1} />
                                </Field>
                            </FieldSet>
                            <FieldSeparator />
                            <FieldSet>
                                <FieldLegend>Listing Information</FieldLegend>
                                <div className='flex flex-row gap-2'>
                                    <Field>
                                        <FieldLabel>Listing Price</FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <InputGroupText>$</InputGroupText>
                                            </InputGroupAddon>
                                                <InputGroupInput {...register("listingPrice") }
                                                    id="listingPrice"
                                                    placeholder="0.00"
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>USD</InputGroupText>
                                                </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Listing Date</FieldLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        data-empty={!listingDate}
                                                        className="w-70 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                                                    >
                                                        <CalendarIcon />
                                                        {listingDate ? format(listingDate, 'MM/dd/yyyy') : <span>Select a Date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" captionLayout="dropdown" selected={listingDate} onSelect={setListingDate} />
                                                </PopoverContent>
                                            </Popover>
                                    </Field>
                                </div>
                                <Field ref={containerRef}>
                                    <FieldLabel>Listing Websites</FieldLabel>
                                    <Picker
                                        items={websites}
                                        values={selectedWebsites}
                                        placeholder={websitesIsLoading ? "Loading..." : "Select websites where item is listed."}
                                        onValueChange={(websites) => setSelectedWebsites(websites)}
                                        itemToStringLabel={(website) => String(website.websiteName)}
                                        itemToStringValue={(website) => String(website.id)}
                                        isItemEqualToValue={(item, value) => item.id === value.id }
                                        renderChip={(item) => <>{item.websiteName}</>}
                                        renderListItem={(item) => (
                                            <div>
                                                <p>{item.websiteName}</p>
                                                <p className='text-sm text-muted-foreground'>{item.url}</p>
                                            </div>
                                        )}
                                        listClassName="flex flex-col"
                                        container={container}
                                    />
                                </Field>
                            </FieldSet>
                        </FieldGroup>
                        <div className="flex flex-row justify-end gap-2 pt-3">
                            <Button type="button" disabled={updateInventoryIsPending} variant="secondary" onClick={()=> handleCancel()}>Cancel</Button>
                            <Button type="submit" disabled={updateInventoryIsPending}>
                                {updateInventoryIsPending ?
                                    <><Loader2 className='animate-spin' /><span>Submitting...</span></> :
                                    <span>List Item</span>
                                }
                                </Button>
                        </div>

                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
};

export default MarkItemListed;


