"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateAnnouncementPayload } from "../types/IAnnouncement";
import EditAnnouncementForm from "../components/EditAnnouncementForm";
import { useAnnouncementById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    AnnouncementId: string;
}

const EditAnnouncement = ({ visible, onClose, AnnouncementId }: Props) => {
    const { data: AnnouncementData } = useAnnouncementById(AnnouncementId);

    const form = useForm<UpdateAnnouncementPayload>({
        defaultValues: {
            id: "",
            title: "",
            description: "",
            announcementPriority: 0
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!AnnouncementData) return;

        reset({
            id: AnnouncementData.id ?? "",
            title: AnnouncementData.title ?? "",
            description: AnnouncementData.description ?? "",
            announcementPriority: AnnouncementData.announcementPriority ?? 0,


        });
    }, [AnnouncementData, reset]);

    if (!visible) return null;

    return (
        <EditAnnouncementForm
            form={form}
            onClose={onClose}
            AnnouncementId={AnnouncementId}
        />
    );
};

export default EditAnnouncement;