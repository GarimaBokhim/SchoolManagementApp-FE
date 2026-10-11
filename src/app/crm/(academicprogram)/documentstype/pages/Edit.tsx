"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateDocumentsTypePayload } from "../types/IDocumentsType";
import AddDocumentsTypeForm from "../components/AddDocumentsTypeForm";
import { useDocumentsTypeById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    DocumentsTypeId: string;
}

const EditDocumentsType = ({ visible, onClose, DocumentsTypeId }: Props) => {
    const {
        data: documentsType,
        isLoading,
        error,
    } = useDocumentsTypeById(DocumentsTypeId);

    const form = useForm<UpdateDocumentsTypePayload>({
        defaultValues: {
            id: "",
            name: ""
        },
    });

    useEffect(() => {
        if (!documentsType) return;

        form.reset({
            id: documentsType.id ?? "",
            name: documentsType.name ?? "",
        });
    }, [documentsType, form]);

    if (!visible) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    Loading document type...
                </div>
            </div>
        );
    }

    if (error || !documentsType) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
                <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
                    <p className="mb-4">Unable to load document type details.</p>
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
                <AddDocumentsTypeForm
                    form={form}
                    onClose={onClose}
                    documentsTypeId={DocumentsTypeId}
                />
            </div>
        </div>
    );
};

export default EditDocumentsType;