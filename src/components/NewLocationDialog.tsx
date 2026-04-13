import { useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "./ui/field";
import { Input } from '@/components/ui/input';
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { LocationForm } from "@/types";
import { useUpload } from "@/hooks/useUploads";
import { Loader2 } from "lucide-react";

interface NewLocationDialogProps {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    onLocationAdded: (data: LocationForm) => Promise<void>;
}



const US_STATES = ['NC', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
  'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'ND', 'OH', 'OK',
  'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

export const NewLocationDialog = ({open, onOpenChange, onLocationAdded}: NewLocationDialogProps): ReactNode => {

    const { register, handleSubmit, control } = useForm<LocationForm>({
        defaultValues: {
            state: "NC"
        }
    });

   const fileInputRef = useRef<HTMLInputElement>(null);
   const [imageFile, setImageFile] = useState<File | undefined>();
   const { mutateAsync: upload, isPending: uploadIsPending } = useUpload();

    const onSubmit: SubmitHandler<LocationForm> = async (data: LocationForm) => {
        try {
            let imageUrl: string | undefined;
            let thumbnailUrl: string | undefined;
            if(imageFile) {
                const result = await upload(imageFile);
                imageUrl = result.data.imageUrl;
                thumbnailUrl = result.data.thumbnailUrl;
            }
            await onLocationAdded({...data, imagePath: imageUrl, thumbnailPath: thumbnailUrl});
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }

    }

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = event.target.files?.[0];
        if(!file) return; 
        console.log(file.name);
        setImageFile(file);
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
                                    <FieldLabel htmlFor="businessName">
                                        Store Name
                                    </FieldLabel>
                                    <Input {...register('businessName')}
                                        id="businessName"
                                        placeholder="ex: Goodwill"
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="shortName">
                                        Short Name
                                    </FieldLabel>
                                    <Input
                                        id="shortName" {...register("shortName")}
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
                                <Input {...register("streetAddress")}
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
                                <Button className="w-1/3" type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                                    Upload Image
                                </Button>
                                <input
                                    className="hidden"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                />
                                {imageFile && <span className="text-sm text-muted-foreground">{imageFile.name}</span>}
                            </div>

                            <Field orientation="horizontal">
                                <Button type="submit" disabled={uploadIsPending}>
                                    {uploadIsPending ?
                                        <><Loader2 className='animate-spin'/><span className='text-muted-foreground'>Saving...</span></> :
                                        <span>Submit</span>
                                    }
                                </Button>
                            </Field>                                
                        </FieldSet>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}