"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UpdateCountryPayload } from "../types/ICountry";
import AddCountryForm from "../components/AddCountryForm";
import { useCountryById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    CountryId: string;
}

const EditCountry = ({ visible, onClose, CountryId }: Props) => {
    const {
        data: country,
        isLoading,
        error,
    } = useCountryById(CountryId);

    const form = useForm<UpdateCountryPayload>({
        defaultValues: {
            id: "",
            name: "",
        },
    });

    useEffect(() => {
        if (!country) return;

        form.reset({
            id: country.id ?? "",
            name: country.name ?? "",
        });
    }, [country, form]);

    if (!visible) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    Loading country...
                </div>
            </div>
        );
    }

    if (error || !country) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    <p className="mb-4">Unable to load country details.</p>
                    <button type="button" onClick={onClose} className="text-blue-600">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16">
            <div className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] max-h-[95vh] md:max-h-[92vh] h-full rounded-lg overflow-auto p-6 md:p-8 shadow-lg">
                <AddCountryForm
                    form={form}
                    onClose={onClose}
                    countryId={CountryId}
                />
            </div>
        </div>
    );
};

export default EditCountry;
