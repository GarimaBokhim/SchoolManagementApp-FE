import { CreditCard } from 'lucide-react';

const VisaProcessingStatusForm = () => {
    const visaSteps = [
        { label: 'Application Submitted', completed: true },
        { label: 'Document Verification', completed: true },
        { label: 'Interview', completed: true },
        { label: 'Background Check', completed: false },
        { label: 'Visa Approval', completed: false },
    ];

    const currentStep = 3;
    const totalSteps = visaSteps.length;
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Visa Processing Status
            </h3>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{visaSteps[currentStep - 1]?.label}</span>
                    <span>{percentage}% Complete</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {visaSteps.map((step, idx) => {
                    const isCompleted = idx < currentStep;

                    return (
                        <div key={idx} className="text-center">
                            <div
                                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${isCompleted
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                {isCompleted ? (
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <span className="text-xs">{idx + 1}</span>
                                )}
                            </div>

                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VisaProcessingStatusForm;