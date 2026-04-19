import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useCallback } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { type InventoryForm, type Inventory, type Season, type Tag } from "@/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import Picker from "./Picker";
import { useSeasons } from "@/hooks/useSeasons";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { useAddTag, useTags } from "@/hooks/useTags";
import Hashtag from "./Hashtag";

type EditItemDetailsProps = {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    item: Inventory;
}

export const EditItemDetails = ({open, onOpenChange, item}: EditItemDetailsProps): ReactNode => {
    
    // React Hook Table
    const {handleSubmit, register} = useForm<InventoryForm>();

    const onSubmit: SubmitHandler<InventoryForm> = async (data: InventoryForm) => {

    }

    // Portal container — captures the dialog DOM node so Base UI portal renders inside it
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const containerRef = useCallback((node: HTMLDivElement | null) => setContainer(node), []);

    // Seasons
    const {data: seasons, isLoading: seasonsIsLoading } = useSeasons();
    const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);

    //Tags
    const { data: tags, isLoading: tagsIsLoading } = useTags();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const { mutateAsync: addTag, isPending: addTagIsPending } = useAddTag();

    const handleAddNewTag = async (tagText: string): Promise<void> => {
        await addTag(tagText);
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div ref={containerRef} />
                <DialogHeader className="text-xl">Edit Item Details</DialogHeader>
                <form id='edit-item-details' onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FieldSet>
                            <Field>
                                <FieldLabel>Seasons</FieldLabel>
                                    <Picker
                                        container={container}
                                        items={seasons}
                                        values={selectedSeasons}
                                        placeholder={seasonsIsLoading ? "Loading..." : "Select a Season"}
                                        onValueChange={(seasons) => {
                                            console.log(seasons)
                                            setSelectedSeasons(seasons)}
                                        }
                                        itemToStringLabel={(season) => String(season.seasonName)}
                                        itemToStringValue={(season) => String(season.id)}
                                        isItemEqualToValue={(item, value) => item.id === value.id}
                                        renderChip={(item) => <>{item.seasonName}</>}
                                        renderListItem={(item) => <>{item.seasonName}</>}
                                    />
                            </Field>
                            <Field>
                                <FieldLabel>Tags</FieldLabel>
                                <Picker
                                    container={container}
                                    items={tags}
                                    values={selectedTags}
                                    placeholder={tagsIsLoading ? "Loading Tags" : "Select Tags"}
                                    onValueChange={(tags) => setSelectedTags(tags)}
                                    itemToStringLabel={(tag) => tag.tagText}
                                    itemToStringValue={(tag) => String(tag.id)}
                                    isItemEqualToValue={(item, value) => item.id === value.id}
                                    renderChip={(item) => <Hashtag tagText={item.tagText} iconSize={14} />}
                                    renderListItem={(item) => <Hashtag tagText={item.tagText} iconSize={20} />}
                                    handleAddNew={handleAddNewTag}
                                    addNewPending={addTagIsPending}
                                />
                            </Field>
                        </FieldSet>
                    </FieldGroup>
                   
                </form>
            </DialogContent>
        </Dialog>
    )
}