'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddUniversityPayload } from '../types/IUniversity'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddUniversity, useGetAllCountry } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import AddCountry from '../../country/pages/Add';

type Props = {
    form: UseFormReturn<AddUniversityPayload>;
    onClose: () => void;
    CountryId: string | null
};
const AddUniversityForm = ({ form, onClose, CountryId }: Props) => {
    const addUniversity = useAddUniversity();
    const { handleError, clearError } = useErrorHandler();
    const { data: country } = useGetAllCountry();
    const [sellectedCountryId, setSelectedCountryId] = useState<string | null>("");

    const [addModal, setAddModal] = useState(false);


    const handleClose = () => {
        form.reset({
            name: "",
            countryId: "",
            universityAddress: "",
            descriptions: "",
            website: "",
            globalRanking: 0
        });
        setSelectedCountryId(null)
        onClose()
    };

    const handleAddSubmit = () => {
        setAddModal(false);
    };


    const onSubmit: SubmitHandler<AddUniversityPayload> = async () => {
        clearError();
        const values = form.getValues();

        const payload = {
            name: values.name,
            countryId: CountryId?.trim() ? CountryId : values.countryId,
            universityAddress: values.universityAddress,
            descriptions: values.descriptions,
            website: values.website,
            globalRanking: values.globalRanking

        };

        await addUniversity.mutateAsync(payload);
        handleClose();
        onClose();
    };
    return (
        <>
            <div className="inset-0 flex items-center justify-center w-full h-full">
                <div className="relative -left-5 w-full h-full bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
                    <fieldset className="">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                                Add University
                            </h1>
                            <button
                                type="button"
                                onClick={() => {
                                    handleClose();
                                    onClose();
                                }}
                                className="text-red-400 text-2xl hover:text-red-500"
                            >
                                <X strokeWidth={3} />
                            </button>
                        </div>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                                {!CountryId &&
                                    <div className="relative">
                                        <AppCombobox
                                            value={sellectedCountryId}
                                            dropDownWidth="w-full"
                                            dropdownPositionClass="absolute z-20"
                                            label="Country"
                                            name="countryId"
                                            form={form}
                                            required
                                            options={country || []}
                                            selected={
                                                country?.find(
                                                    (g) => g.id === sellectedCountryId
                                                ) || null
                                            }
                                            onSelect={(group) => {
                                                if (group) {
                                                    const id = group.id ?? "";

                                                    setSelectedCountryId(id || null);

                                                    form.setValue("countryId", id, {
                                                        shouldValidate: true,
                                                    });
                                                } else {
                                                    setSelectedCountryId(null);

                                                    form.setValue("countryId", "", {
                                                        shouldValidate: true,
                                                    });
                                                }
                                            }}
                                            getLabel={(g) => g?.name ?? ""}
                                            getValue={(g) => g?.id ?? ""}
                                        />

                                        {/* <button
                                            type="button"
                                            onClick={() => setAddModal(true)}
                                            className="absolute top-2 right-0 z-30 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700"
                                        >
                                            <Plus size={16} />
                                        </button> */}
                                    </div>

                                }
                                <InputElement
                                    label="Name"
                                    form={form}
                                    name="name"
                                    required
                                />








                                <InputElement
                                    label="UniversityAddress"
                                    form={form}
                                    name="universityAddress"
                                    required
                                />

                                <InputElement
                                    label="Descriptions"
                                    form={form}
                                    name="descriptions"
                                    required
                                />

                                <InputElement
                                    label="Website"
                                    form={form}
                                    name="website"
                                    required
                                />

                                <InputElement
                                    label="GlobalRanking"
                                    form={form}
                                    name="globalRanking"
                                    inputType="number"
                                    required
                                />



                            </div>


                            <div className="flex justify-center mt-6">
                                <ButtonElement type="submit" text={"Submit"} />
                            </div>
                        </form>
                    </fieldset>
                </div>
            </div>

            <AddCountry
                visible={addModal}
                onClose={handleAddSubmit}
            />
        </>

    );


};

export default AddUniversityForm;
