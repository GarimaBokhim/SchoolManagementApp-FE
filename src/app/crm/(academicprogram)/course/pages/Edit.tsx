"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { UpdateCoursePayload } from "../types/ICourse";
import EditCourseForm from "../components/EditCourseForm";
import { useCourseById } from "../hooks";

interface Props {
    visible: boolean;
    onClose: () => void;
    CourseId: string;
}

const EditCourse = ({ visible, onClose, CourseId }: Props) => {
    const { data: CourseData } = useCourseById(CourseId);

    const form = useForm<UpdateCoursePayload>({
        defaultValues: {
            id: "",
            title: "",
            studyLevel: 0,
            tuationFee: 0,
            currency: "",
            universityId: ""
        },
    });

    const { reset } = form;

    useEffect(() => {
        if (!CourseData) return;

        reset({
            id: CourseData.id ?? "",
            title: CourseData.title ?? "",
            studyLevel: CourseData.studyLevel ?? 0,
            tuationFee: CourseData.tuationFee ?? 0,
            currency: CourseData.currency ?? "",
            universityId: CourseData.universityId ?? ""

        });
    }, [CourseData, reset]);

    if (!visible) return null;

    return (
        <EditCourseForm
            form={form}
            onClose={onClose}
            CourseId={CourseId}
        />
    );
};

export default EditCourse;