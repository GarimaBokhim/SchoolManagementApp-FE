"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/instance";
import { InquiryResponse } from "../types/IAppointment";
import { Award, BarChart3, BookOpen, Building2, Calendar, CalendarDays, CalendarRange, ClipboardList, FileText, GraduationCap, Languages, Mail, MapPin, MessageSquare, Phone, School, Share2, Users, Wrench } from "lucide-react";

interface LeadDetailsProps {
    inquiryId: string | null;
}

export const LeadDetailsForm = ({ inquiryId }: LeadDetailsProps) => {
    const [detail, setDetail] = useState<InquiryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);




    const enrollmentType = [
        { id: 1, name: 'Lead' },
        { id: 2, name: 'Applicant' },
        { id: 3, name: 'Student' },
        { id: 4, name: 'Counseling' },
        { id: 5, name: 'Qualified' },
        { id: 6, name: 'Rejected' },
        { id: 7, name: 'New' }
    ];

    const genderType = [
        { id: 1, name: 'Male' },
        { id: 2, name: 'Female' },
        { id: 3, name: 'Others' }
    ];

    const educationLevelType = [
        { id: 1, name: 'PlusTwoIntermediate' },
        { id: 2, name: 'Bachelors' },
        { id: 3, name: 'Masters' }
    ];

    const englishProficiency = [
        { id: 1, name: 'IELTS' },
        { id: 2, name: 'TOEFL' },
        { id: 3, name: 'PTE' },
        { id: 4, name: 'DET' },
        { id: 5, name: 'TOEIC' },
        { id: 6, name: 'CELPIP' },
        { id: 7, name: 'OET' },
        { id: 8, name: 'FCE' },
        { id: 9, name: 'CAE' },
        { id: 10, name: 'CPE' }
    ];


    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get<InquiryResponse>(
                    `/api/Enrolments/Inquiry/${inquiryId}`
                );

                setDetail(response.data);
            } catch (error) {
                console.error(error);
                setError("Failed to load inquiry details.");
            } finally {
                setLoading(false);
            }
        };

        if (inquiryId) {
            fetchDetail();
        }
    }, [inquiryId]);

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg border">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg border text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">
                Inquiry Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoItem
                    icon={<Mail size={18} />}
                    label="Email"
                    value={detail?.email}
                />

                <InfoItem
                    icon={<Phone size={18} />}
                    label="Phone"
                    value={detail?.contactNumber}
                />

                <InfoItem
                    icon={<GraduationCap size={18} />}
                    label="Enrolment Type"
                    value={
                        enrollmentType.find(
                            (i) => i.id === detail?.enrolmentType
                        )?.name
                    }
                />

                <InfoItem
                    icon={<Calendar size={18} />}
                    label="Date of Birth"
                    value={detail?.dateOfBirth ? detail.dateOfBirth.split("T")[0] : ""}
                />

                <InfoItem
                    icon={<Users size={18} />}
                    label="Gender"
                    value={
                        genderType.find(
                            (i) => i.id === detail?.gender
                        )?.name
                    }
                />

                <InfoItem
                    icon={<MapPin size={18} />}
                    label="Permanent Address"
                    value={detail?.permanentAddress}
                />

                <InfoItem
                    icon={<School size={18} />}
                    label="Education Level"
                    value={
                        educationLevelType.find(
                            (i) => i.id === detail?.educationLevel
                        )?.name
                    }
                />

                <InfoItem
                    icon={<CalendarDays size={18} />}
                    label="Completion Year"
                    value={detail?.completionYear}
                />

                <InfoItem
                    icon={<Award size={18} />}
                    label="Current GPA"
                    value={detail?.currentGpa}
                />

                <InfoItem
                    icon={<BookOpen size={18} />}
                    label="Previous Qualification"
                    value={detail?.previousAcademicQualification}
                />

                <InfoItem
                    icon={<Languages size={18} />}
                    label="English Proficiency"
                    value={
                        englishProficiency.find(
                            (i) => i.id === detail?.englishProficiency
                        )?.name
                    }
                />

                <InfoItem
                    icon={<BarChart3 size={18} />}
                    label="Band Score"
                    value={detail?.bandScore}
                />

                <InfoItem
                    icon={<MessageSquare size={18} />}
                    label="Language Remarks"
                    value={detail?.languageRemarks}
                />

                <InfoItem
                    icon={<Wrench size={18} />}
                    label="Skill Or Training"
                    value={detail?.skillOrTrainingName}
                />

                <InfoItem
                    icon={<Building2 size={18} />}
                    label="Institution Name"
                    value={detail?.institutionName}
                />

                <InfoItem
                    icon={<FileText size={18} />}
                    label="Training Remarks"
                    value={detail?.trainingRemarks}
                />

                <InfoItem
                    icon={<CalendarRange size={18} />}
                    label="Training Start Date"
                    value={detail?.trainingStartDate}
                />

                <InfoItem
                    icon={<CalendarRange size={18} />}
                    label="Training End Date"
                    value={detail?.trainingEndDate}
                />

                <InfoItem
                    icon={<Share2 size={18} />}
                    label="Source"
                    value={detail?.source}
                />

                <InfoItem
                    icon={<ClipboardList size={18} />}
                    label="Feedback / Suggestion"
                    value={detail?.feedBackOrSuggestion}
                />
            </div>
        </div>
    );
};

const InfoItem = ({
    label,
    value,
    icon,
}: {
    label: string;
    value?: string | number | null;
    icon?: React.ReactNode;
}) => (
    <div className="border rounded-lg p-4 bg-white hover:shadow-sm transition">
        <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">
                {icon}
            </span>

            <span className="text-xs font-medium text-gray-500 uppercase">
                {label}
            </span>
        </div>

        <p className="text-sm font-semibold text-gray-900 break-words">
            {value || "-"}
        </p>
    </div>
);