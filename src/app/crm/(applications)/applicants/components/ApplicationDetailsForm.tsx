import { Award, Banknote, BookOpen, Calendar, CheckCircle, Clock, CreditCard, DollarSign, FileCheck, FileSignature, FileText, FileWarning, GraduationCap, Loader2, Mail, MessageSquare, Plane, Send, Stamp, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useGetVisaRequirements, useUpdateSingleVisaStatus } from '../hooks';
import toast from 'react-hot-toast';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { updateSingleVisaStatusPayload } from '../types/IApplicants';
import { AppCombobox } from '@/components/Input/ComboBox';


type Props = {
    ApplicantId: string;
};
const ApplicationDetailsForm = ({ ApplicantId }: Props) => {

    const [selectedStep, setSelectedStep] = useState<any>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<number>(2);
    const { handleError, clearError } = useErrorHandler();

    const statusOptions = [
        { id: 1, name: "Completed" },
        { id: 2, name: "Pending" },
        { id: 3, name: "Rejected" },
    ];

    const handleStepClick = (step: any) => {
        setSelectedStep(step);
        setSelectedStatus(step.status);
        setShowStatusModal(true);
    };

    const {
        data: visaRequirementsSteps,
        isLoading,
        refetch,
    } = useGetVisaRequirements(ApplicantId);

    const updateSingleVisaStatus = useUpdateSingleVisaStatus();

    const [activeTab, setActiveTab] = useState('visa')
    const TABS = [
        { id: 'visa', label: 'VISA', icon: CreditCard },
        { id: 'scores', label: 'SCORES', icon: Award },
        { id: 'academics', label: 'ACADEMICS', icon: BookOpen },
        { id: 'testDates', label: 'TEST DATES', icon: Calendar },
        { id: 'payments', label: 'PAYMENTS', icon: DollarSign },
        { id: 'classes', label: 'CLASSES', icon: GraduationCap },
        { id: 'emailHistory', label: 'EMAIL HISTORY', icon: Mail },
        { id: 'smsHistory', label: 'SMS HISTORY', icon: MessageSquare },
    ]

    const visaTimelineSteps = (visaRequirementsSteps?.Items ?? [])
        .flatMap(item => item.visaRequirementsDTOs)
        .sort((a, b) => a.step - b.step)
        .map(item => ({
            label: item.visaStatusName.toUpperCase(),
            id: item.id,
            completed: item.visaStatus === 1,
            rejected: item.visaStatus === 3,
            stepNumber: item.step,
            icon: item.visaStatus === 1 ? CheckCircle : FileText,
            date: item.visaStatus === 1 ? "Completed" : "Pending",
        }));


    const VisaTimeline = () => {
        const [hoveredStep, setHoveredStep] = useState<number | null>(null)
        const [isUpdating, setIsUpdating] = useState(false)
        const [isCancelling, setIsCancelling] = useState(false)

        const handleSubmit = async () => {
            if (!selectedStep) return;

            clearError();

            try {
                const payload: updateSingleVisaStatusPayload = {
                    id: selectedStep.id,
                    status: selectedStatus,
                };

                // API expects an object with top-level id and a nested payload
                const promise = updateSingleVisaStatus.mutateAsync({ id: payload.id, payload });

                await toast.promise(promise, {
                    loading: "Updating visa status...",
                });

                await refetch();

                setShowStatusModal(false);
            } catch (error) {
                const errorMsg = handleError(error);
            }
        };

        const handleCancel = () => {
            if (confirm('Are you sure you want to cancel this application? This action cannot be undone.')) {
                setIsCancelling(true)
                // Simulate API call
                setTimeout(() => {
                    setIsCancelling(false)
                    alert('Application cancelled successfully!')
                }, 1500)
            }
        }

        return (
            <div className="space-y-6">
                {/* Timeline - Horizontal flex wrap with connecting lines */}
                <div className="relative">
                    {/* Thin line background that runs through all steps */}
                    <div className="absolute top-[27px] left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" style={{ width: 'calc(100% - 2rem)', margin: '0 1rem' }}></div>

                    <div className="flex flex-wrap justify-start items-start gap-y-8 gap-x-4 md:gap-x-8 relative">
                        {visaTimelineSteps.map((step, idx) => {
                            const Icon = step.icon
                            const isCompleted = step.completed
                            const isRejected = step.rejected && !isCompleted
                            const isCurrent = !isCompleted && !isRejected && idx === visaTimelineSteps.findIndex(s => !s.completed)

                            return (


                                <div
                                    key={idx}
                                    className="relative flex flex-col items-center group"
                                    style={{ flex: '0 0 auto', width: 'clamp(100px, 12vw, 140px)' }}
                                    onMouseEnter={() => setHoveredStep(idx)}
                                    onMouseLeave={() => setHoveredStep(null)}
                                >
                                    {/* Connector line between steps (visible on larger screens) */}
                                    {idx > 0 && (
                                        <div className="hidden md:block absolute -left-[calc(50%+1rem)] top-[27px] w-[calc(100%+2rem)] h-0.5">
                                            <div className={`w-full h-full transition-all duration-500 ${visaTimelineSteps[idx - 1].completed
                                                ? 'bg-purple-500'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                                }`} />
                                        </div>
                                    )}

                                    {/* Icon Circle */}
                                    {/* Icon Circle */}
                                    <div
                                        onClick={() => handleStepClick(step)}
                                        className={`
        relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 mb-3 cursor-pointer
        ${isCompleted
                                                ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30'
                                                : isRejected
                                                    ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30'
                                                    : isCurrent
                                                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30 animate-pulse'
                                                        : 'bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-500'
                                            }
        ${hoveredStep === idx ? 'scale-110' : 'scale-100'}
    `}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-7 h-7 text-white" />
                                        ) : (
                                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                {step.stepNumber}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="w-full text-center">
                                        <div className={`rounded-lg p-3 transition-all duration-300 w-full
                                                ${isCompleted
                                                ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                                                : isRejected
                                                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                                    : isCurrent
                                                        ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 shadow-md'
                                                        : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                                            }
                                                ${hoveredStep === idx ? 'shadow-lg' : ''}
                                            `}>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-center gap-1 flex-wrap">
                                                    <h5 className={`font-bold text-xs uppercase tracking-wide text-center
                                                    ${isCompleted
                                                            ? 'text-purple-700 dark:text-purple-300'
                                                            : isRejected
                                                                ? 'text-red-700 dark:text-red-300'
                                                                : isCurrent
                                                                    ? 'text-amber-700 dark:text-amber-300'
                                                                    : 'text-gray-600 dark:text-gray-400'
                                                        }`}>
                                                        {step.label}
                                                    </h5>
                                                    {isCurrent && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-full whitespace-nowrap">
                                                            Current
                                                        </span>
                                                    )}
                                                    {isRejected && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-full whitespace-nowrap">
                                                            Rejected
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                                    Step {step.stepNumber} of {visaTimelineSteps.length}
                                                </p>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                                        {step.date !== 'Pending' && step.date !== 'N/A' ? (
                                                            <span className="flex items-center justify-center gap-1">
                                                                <Calendar className="w-2.5 h-2.5" />
                                                                {step.date}
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center justify-center gap-1">
                                                                <Clock className="w-2.5 h-2.5" />
                                                                {step.date}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>



                                            {isRejected && (
                                                <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                                                    <p className="text-[10px] text-red-700 dark:text-red-300">
                                                        Contact support
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {showStatusModal && selectedStep && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">

                        <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Update Visa Status
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Update the current visa processing status.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="w-9 h-9 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-800 flex items-center justify-center transition"
                                >
                                    <X
                                        size={18}
                                        className="text-red-600 dark:text-red-400"
                                    />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-5">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Step
                                    </label>

                                    <input
                                        value={`Step ${selectedStep.stepNumber}`}
                                        disabled
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Status
                                    </label>

                                    <input
                                        value={selectedStep.label}
                                        disabled
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm"
                                    />
                                </div>

                                <AppCombobox
                                    label="New Status"
                                    dropdownPositionClass="absolute"
                                    name="status"
                                    value={selectedStatus}
                                    options={statusOptions}
                                    dropDownWidth="w-full"
                                    selected={
                                        statusOptions.find(
                                            (option) => option.id === selectedStatus
                                        ) ?? null
                                    }
                                    onSelect={(option) => {
                                        if (option) {
                                            setSelectedStatus(option.id);
                                        }
                                    }}
                                    getLabel={(option) => option?.name ?? ''}
                                    getValue={(option) => option?.id ?? ''}
                                />

                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">

                                <button
                                    type="button"
                                    onClick={() => setShowStatusModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
                                >
                                    Update Status
                                </button>

                            </div>

                        </div>

                    </div>
                )}
            </div>
        )
    }



    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Tab Headers */}
                <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-x-auto">
                    {TABS.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-800'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content - VISA tab now shows the detailed timeline */}
                <div className="p-6 min-h-[400px]">
                    {activeTab === 'visa' && <VisaTimeline />}

                    {activeTab === 'scores' && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                            <Award size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No Scores Available</p>
                        </div>
                    )}
                    {activeTab === 'academics' && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                            <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No Academic Records</p>
                        </div>
                    )}
                    {activeTab === 'testDates' && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                            <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No Test Dates Scheduled</p>
                        </div>
                    )}
                    {activeTab === 'payments' && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                            <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No Payment Records</p>
                        </div>
                    )}
                    {activeTab === 'classes' && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                            <GraduationCap size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No Classes Available</p>
                        </div>
                    )}
                    {activeTab === 'emailHistory' && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                            <Mail size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No Email History</p>
                        </div>
                    )}
                    {activeTab === 'smsHistory' && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                            <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No SMS History</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-2">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    Message
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                    Schedule Appointment
                </button>
            </div>
        </>

    );
};

export default ApplicationDetailsForm;