import { Award, Banknote, BookOpen, Calendar, CheckCircle, Clock, CreditCard, DollarSign, FileCheck, FileSignature, FileText, FileWarning, GraduationCap, Loader2, Mail, MessageSquare, Plane, Send, Stamp, XCircle } from 'lucide-react';
import { useState } from 'react';

const ApplicationDetailsForm = () => {

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

    const visaTimelineSteps = [
        {
            label: 'APPLIED FOR OFFER LETTER',
            completed: true,
            stepNumber: 1,
            icon: FileSignature,
            date: 'March 10, 2026'
        },
        {
            label: 'OFFER LETTER RECEIVED',
            completed: true,
            stepNumber: 2,
            icon: FileCheck,
            date: 'March 25, 2026'
        },
        {
            label: 'COE RECEIVED',
            completed: true,
            stepNumber: 3,
            icon: CheckCircle,
            date: 'April 5, 2026'
        },
        {
            label: 'GTE DOCUMENT APPROVAL REQUEST',
            completed: true,
            stepNumber: 4,
            icon: FileWarning,
            date: 'April 10, 2026'
        },
        {
            label: 'GTE DOCUMENT APPROVED',
            completed: false,
            stepNumber: 5,
            icon: Stamp,
            date: 'Pending'
        },
        {
            label: 'TUITION FEE PAID',
            completed: false,
            stepNumber: 6,
            icon: Banknote,
            date: 'Pending'
        },
        {
            label: 'VISA APPLIED',
            completed: false,
            stepNumber: 7,
            icon: Send,
            date: 'Pending'
        },
        {
            label: 'VISA GRANTED',
            completed: false,
            stepNumber: 8,
            icon: Plane,
            date: 'Pending'
        },
        {
            label: 'VISA REJECTED',
            completed: false,
            stepNumber: 9,
            icon: XCircle,
            date: 'N/A',
            isRejected: true
        },
    ]

    const VisaTimeline = () => {
        const [hoveredStep, setHoveredStep] = useState<number | null>(null)
        const [isUpdating, setIsUpdating] = useState(false)
        const [isCancelling, setIsCancelling] = useState(false)

        const handleUpdate = () => {
            setIsUpdating(true)
            // Simulate API call
            setTimeout(() => {
                setIsUpdating(false)
                alert('Application updated successfully!')
            }, 1500)
        }

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
                            const isRejected = step.isRejected && !isCompleted
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
                                    <div
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
                                            <Icon className={`w-6 h-6 ${isRejected ? 'text-white' : isCurrent ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
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

                                            {/* Status message for current/rejected steps */}
                                            {isCurrent && (
                                                <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800">
                                                    <p className="text-[10px] text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1">
                                                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                                        Awaiting...
                                                    </p>
                                                </div>
                                            )}

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

                {/* Update and Cancel Buttons - Replacing Summary Card */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">Visa Application Status</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {visaTimelineSteps.filter(s => s.completed).length} of {visaTimelineSteps.length} steps completed
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating || isCancelling}
                                className={`
                    px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    flex items-center gap-2
                    ${isUpdating || isCancelling
                                        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                    }
                  `}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FileSignature className="w-4 h-4" />
                                        Update Application
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleCancel}
                                disabled={isUpdating || isCancelling}
                                className={`
                    px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    flex items-center gap-2
                    ${isUpdating || isCancelling
                                        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                                        : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                                    }
                  `}
                            >
                                {isCancelling ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4" />
                                        Cancel Application
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
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