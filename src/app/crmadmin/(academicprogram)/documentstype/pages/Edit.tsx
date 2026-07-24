"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateDocumentsTypePayload } from "../types/IDocumentsType";
import EditDocumentsTypeForm from "../components/EditDocumentsTypeForm";
import { useDocumentsTypeById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    DocumentsTypeId: string;
}

const EditDocumentsType = ({ visible, onClose, DocumentsTypeId }: Props) => {
    const { data: DocumentsTypeData } = useDocumentsTypeById(DocumentsTypeId);

    const form = useForm<UpdateDocumentsTypePayload>({
        defaultValues: {
            id: "",
            name: ""
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!DocumentsTypeData) return;

        reset({
            id: DocumentsTypeData.id ?? "",
            name: DocumentsTypeData.name ?? ""


        });
    }, [DocumentsTypeData, reset]);

    if (!visible) return null;

    return (
        <EditDocumentsTypeForm
            form={form}
            onClose={onClose}
            DocumentsTypeId={DocumentsTypeId}
        />
    );
};

export default EditDocumentsType;