import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import type { Inventory } from "@/types";
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
import { itemListedSchema, type ItemListedForm } from "./MarkItemListed.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldError from "./FormFieldError";
import { toast } from "sonner";

type MarkItemListedProps = {
    item: Inventory | undefined;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const MarkItemListed = ({open, item, onOpenChange}: MarkItemListedProps): React.ReactNode => {

    const {register, handleSubmit, setValue, reset, formState: { errors }, control } = useForm<ItemListedForm>({
        resolver: zodResolver(itemListedSchema)
    });
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const containerRef = useCallback((node: HTMLDivElement | null) => setContainer(node), []);

    const { data: websites, isLoading: websitesIsLoading } = useWebsites();
    const { mutateAsync: updateInventory, isPending: updateInventoryIsPending } = useUpdateInventory(item?.sku ?? '');

    const websiteIds = useWatch({ control, name: 'websiteIds' }) ?? [];
    const selectedWebsites = websites?.filter(w => websiteIds.includes(w.id)) ?? [];

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    }

    const listingDate = useWatch({control, name: "listingDate"});

    const setListingDate = (value: Date | undefined) => setValue('listingDate', value);

    const onSubmit: SubmitHandler<ItemListedForm> = async (data: ItemListedForm) => {
        const payload = {
            ...data,
            boxId: data.boxId || null,
            listingPrice: data.listingPrice || null,
            statusDate: listingDate,
            websiteIds: data.websiteIds,
            status: "Listed",
            notes: `Item listed on ${selectedWebsites.map(web => web.websiteName).join(' ,')}`
        }

        await updateInventory(payload);
        toast.success(`${item?.shortDescription} listed for sale!`);
        reset();
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
                                    <Input {...register("boxId", { valueAsNumber: true })} type="number" min={1} />
                                    <FormFieldError error={errors.boxId} />
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
                                                <InputGroupInput {...register("listingPrice", { valueAsNumber: true }) }
                                                    id="listingPrice"
                                                    placeholder="0.00"
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>USD</InputGroupText>
                                                </InputGroupAddon>
                                        </InputGroup>
                                        <FormFieldError error={errors.listingPrice} />
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
                                        <FormFieldError error={errors.listingDate} />
                                    </Field>
                                </div>
                                <Field ref={containerRef}>
                                    <FieldLabel>Listing Websites</FieldLabel>
                                    <Picker
                                        items={websites}
                                        values={selectedWebsites}
                                        placeholder={websitesIsLoading ? "Loading..." : "Select websites where item is listed."}
                                        onValueChange={(websites) => setValue('websiteIds', websites.map(w => w.id))}
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
                                    <FormFieldError error={errors.websiteIds} />
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


