'use client'

import { useEffect, useState } from 'react'
import { api } from '@/utils/instance'
import { RefreshCw, ClipboardList, User, UserCheck, X } from 'lucide-react'
import OverviewTab from '../pages/OverViewTabs'
import ActivityTab from '../pages/AcademicTabs'
import FollowUpTab from '../pages/FollowUpTab'
import { AppointmentDetailsResponse } from '../types/IAppointment'
import { useGetAllCountry, useGetAllCourse, useGetAllUniversity, useLeadEnquiryDetailsById } from '../hooks'
import { useForm, UseFormReturn } from 'react-hook-form'
import AcademicTabs from '../pages/AcademicTabs'
import ConvertToApplicant from '../pages/ConvertToApplicant'


export const AppointmentDetailModal = ({
    isOpen,
    onClose,
    AppointmentId,
    LeadId,
    UserId
}: {
    isOpen: boolean
    onClose: () => void
    AppointmentId: string
    LeadId: string | null
    UserId: string
}) => {

    const form = useForm({
        defaultValues: {
            notes: "",
        },
    });




    const [loading, setLoading] = useState(false)

    const [detail, setDetail] = useState<AppointmentDetailsResponse | null>(null);
    const { data: leadEnquiryDetails } = useLeadEnquiryDetailsById(LeadId);
    const { data: countryData = [] } = useGetAllCountry();
    const { data: courseData = [] } = useGetAllCourse();
    const { data: universityData = [] } = useGetAllUniversity();

    const scheduleStatus = [
        { id: 1, name: 'Scheduled' },
        { id: 2, name: 'Completed' },
        { id: 3, name: 'Cancelled' },
        { id: 4, name: 'NoShow' }
    ];

    const [activeTab, setActiveTab] =
        useState<string>('overview')

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'academics', label: 'Academics' },
        { id: 'followups', label: 'Follow Ups' },
        { id: 'convert', label: 'Convert' }
    ]

    useEffect(() => {
        if (!isOpen || !AppointmentId) return

        const fetchData = async () => {
            try {
                setLoading(true)

                const res = await api.get(
                    `/api/Enrolments/AppointmentsById/${AppointmentId}`
                )

                setDetail(res.data)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [isOpen, AppointmentId])

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <OverviewTab
                        detail={detail}
                        form={form}
                        leadEnquiryDetails={leadEnquiryDetails}
                        countryData={countryData}
                        universityData={universityData}
                        courseData={courseData}
                        AppointmentId={AppointmentId}
                    />
                )

            case 'academics':
                return (
                    <AcademicTabs
                        LeadId={LeadId}
                    />
                )

            case 'followups':
                return (
                    <FollowUpTab
                        AppointmentId={AppointmentId}
                        UserId={UserId}
                    />
                )

            case 'convert':
                return (
                    <ConvertToApplicant
                        userId={UserId}
                    />
                )

            default:
                return null
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
                 bg-black/40 backdrop-blur-sm ml-15 md:ml-64 sm:ml-16 xs:ml-0"
        >
            <div className="w-full max-w-[75rem] bg-white rounded-2xl overflow-hidden flex flex-col max-h-[92vh]">

                {/* HEADER */}

                <div className="px-6 py-5 border-b flex justify-between">

                    {/* LEFT */}
                    <div className="flex items-start gap-4">

                        {/* Avatar / Initial Circle */}
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-sm">
                            <ClipboardList size={18} />

                        </div>

                        {/* Main Info */}
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                Appointment
                            </h2>

                            {/* Meta line */}
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-md text-zinc-700 dark:text-zinc-300 font-bold">
                                <span className="flex items-center gap-1">
                                    <User size={12} />
                                    {detail?.leadName}
                                </span>

                                <div className="ml-2">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-md font-bold
                          ">

                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        {scheduleStatus.find(
                                            (s) => s.id === Number(detail?.appointmentStatus)
                                        )?.name}
                                    </span>
                                </div>

                                <p className="flex items-center gap-2 text-md font-medium text-zinc-500 mt-1">
                                    <UserCheck size={14} className="text-blue-600" />

                                    <span>Counselor:</span>

                                    <span className="text-md font-bold text-zinc-800 dark:text-zinc-100">
                                        {detail?.counselorName}
                                    </span>
                                </p>
                            </div>


                        </div>

                        {/* STATUS BADGE */}


                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-2">

                        {/* Quick info card */}
                        <div className="text-right">
                            <span className="text-md text-gray-600 uppercase">Date</span>
                            <p className="text-md font-bold text-gray-900">
                                {detail?.appointmentDate ? detail.appointmentDate.split("T")[0] : ""}
                            </p>
                            <p className="text-md text-gray-600">
                                {detail?.appointmentDate
                                    ? new Date(detail.appointmentDate).toLocaleDateString("en-US", {
                                        weekday: "long",
                                    })
                                    : ""}
                            </p>
                        </div>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="ml-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* TABS */}

                <div className="bg-blue-100 px-4 pt-4 flex gap-1">

                    {tabs.map((t) => {

                        const isActive =
                            activeTab === t.id

                        return (
                            <button
                                key={t.id}
                                onClick={() =>
                                    setActiveTab(t.id)
                                }
                                className={
                                    'px-6 py-2 text-sm font-medium transition-all ' +
                                    (
                                        isActive
                                            ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                                            : 'text-blue-600 hover:bg-blue-200 rounded-sm'
                                    )
                                }
                            >
                                {t.label}
                            </button>
                        )
                    })}
                </div>

                {/* CONTENT */}

                <div className="flex-1 overflow-y-auto p-6">

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <RefreshCw className="animate-spin" />
                        </div>
                    ) : (
                        renderContent()
                    )}
                </div>


            </div>
        </div>
    )
}