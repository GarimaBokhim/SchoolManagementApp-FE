'use client'
import { X } from 'lucide-react'
import { AddCountryPayload, UpdateCountryPayload } from '../types/ICountry'
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useAddCountry, useUpdateCountry } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";

type Props = {
    form: UseFormReturn<UpdateCountryPayload>;
    onClose: () => void;
    countryId?: string;
};
const AddCountryForm = ({ form, onClose, countryId }: Props) => {
    const addCountry = useAddCountry();
    const updateCountry = useUpdateCountry();
    const { handleError, clearError } = useErrorHandler();
    const isEditing = Boolean(countryId);

    const handleClose = () => {
        form.reset({ id: "", name: "" });
        onClose()
    };


    const onSubmit: SubmitHandler<UpdateCountryPayload> = async (data) => {
        clearError();
        try {
            if (countryId) {
                await updateCountry.mutateAsync({
                    id: countryId,
                    payload: {
                        id: countryId,
                        name: data.name,
                    },
                });
            } else {
                const payload: AddCountryPayload = { name: data.name };
                await addCountry.mutateAsync(payload);
            }
            handleClose();
        } catch (error) {
            handleError(error);
        }
    };
    return (
        <div className="inset-0 flex items-center justify-center w-full h-full -ml-5">
            <div className="relative w-full h-full bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto dark:text-white">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            {isEditing ? "Update Country" : "Add Country"}
                        </h1>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-red-400 text-2xl hover:text-red-500"
                            aria-label="Close"
                        >
                            <X strokeWidth={3} />
                        </button>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

                            <InputElement
                                label="Name"
                                form={form}
                                name="name"
                                required
                            />

                        </div>


                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={isEditing ? "Update Country" : "Submit"}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default AddCountryForm;
