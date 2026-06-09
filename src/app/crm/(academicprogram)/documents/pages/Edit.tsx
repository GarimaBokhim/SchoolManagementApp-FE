"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { DocumentsIdResponse, UpdateDocumentsPayload } from "../types/IDocuments";
import EditDocumentsForm from "../components/EditDocumentsForm";
import { useDocumentsById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    DocumentsId: string;
}

const EditDocuments = ({ visible, onClose, DocumentsId }: Props) => {
    const { data: DocumentsData } = useDocumentsById(DocumentsId);

    console.log("DocumentsData", DocumentsData);

    const form = useForm<UpdateDocumentsPayload>({
        defaultValues: {
            id: "",
            applicantId: "",
            documentsByIdDTOs: [
                {
                    documentTypeId: "",
                    documentStatus: 0,
                    documentsUrl: "",
                    docFile: null
                },
            ],
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!DocumentsData) return;

        reset({
            id: DocumentsData.id ?? "",
            applicantId: DocumentsData.applicantId ?? "",
            documentsByIdDTOs: [
                {
                    documentTypeId: DocumentsData.documentsByIdDTOs?.documentTypeId ?? "",
                    documentStatus: DocumentsData.documentsByIdDTOs?.documentStatus ?? 0,
                    documentsUrl: DocumentsData.documentsByIdDTOs?.documentsUrl ?? "",
                    docFile: null,
                },
            ],
        });
    }, [DocumentsData, reset]);

    if (!visible) return null;

    return (
        <EditDocumentsForm
            form={form}
            onClose={onClose}
            DocumentsId={DocumentsId}
        />
    );
};

export default EditDocuments;