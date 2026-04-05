import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "./ui/field";
import { Input } from '@/components/ui/input';
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { LocationFormData } from "@/types";

interface NewLocationDialogProps {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    onLocationAdded: (data: LocationFormData) => Promise<void>;
}



const US_STATES = ['NC', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
  'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'ND', 'OH', 'OK',
  'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

export const NewLocationDialog = ({open, onOpenChange, onLocationAdded}: NewLocationDialogProps): ReactNode => {

    const { register, handleSubmit, control } = useForm<LocationFormData>({
        defaultValues: {
            state: "NC"
        }
    });

    const [imgPath, setImgPath] = useState<string | null>();

    const onSubmit: SubmitHandler<LocationFormData> = async (data: LocationFormData) => {
        await onLocationAdded({...data, image_path: imgPath});
        onOpenChange(false);
    }

    const handleUpload = async (): Promise<void> => {
        const newPath = await window.api.files.selectImage();
        setImgPath(newPath);
        console.log(newPath);
    }

    const getFileName = (path: string): string | undefined => {
        return path.split(/[\\/]/).pop()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <form id='new-location-form' onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Location Information</FieldLegend>
                                <Field>
                                    <FieldLabel htmlFor="business_name">
                                        Store Name
                                    </FieldLabel>
                                    <Input {...register('business_name')}
                                        id="business_name"
                                        placeholder="ex: Goodwill"
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="short_name">
                                        Short Name
                                    </FieldLabel>
                                    <Input
                                        id="short_name" {...register("short_name")}
                                        placeholder="ex: GW"
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="description">
                                        Description
                                    </FieldLabel>
                                    <Input {...register("description")}
                                        id="description"
                                        placeholder="The goodwill next to Clear Creek"
                                    />
                                </Field>
                        </FieldSet>
                        <FieldSeparator/>
                        <FieldSet>
                            <FieldLegend>Location Address</FieldLegend>
                            <Field>
                                <FieldLabel htmlFor="address">Street Address</FieldLabel>
                                <Input {...register("street_address")}
                                    id="address"
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-2">
                                <Field>
                                    <FieldLabel htmlFor="city">City</FieldLabel>
                                    <Input {...register("city")}
                                        id="city"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="state">State</FieldLabel>
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({field}) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder={US_STATES[0]} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {US_STATES.map((state , i) => (
                                                            <SelectItem key={i} value={state}>{state}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button className="w-1/3" type="button" variant="secondary" onClick={handleUpload}>
                                    Upload Image
                                </Button>
                                {imgPath && <span className="text-sm text-muted-foreground">{getFileName(imgPath)}</span>}
                            </div>

                            <Field orientation="horizontal">
                                <Button type="submit">Submit</Button>
                            </Field>                                
                        </FieldSet>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}