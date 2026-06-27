import { CreditCard } from "lucide-react";
import { useGetVisaRequirements, useVisaDetailsByApplicant } from "../hooks";

type Props = {
    ApplicantId: string;
};

const VisaProcessingStatusForm = ({ ApplicantId }: Props) => {
    const { data: visaDetails } = useVisaDetailsByApplicant(ApplicantId);

    const { data: visaRequirementsSteps, isLoading } = useGetVisaRequirements(
        visaDetails?.countryId,
        visaDetails?.universityId,
        visaDetails?.courseId
    );

    // Get the first requirement (API returns Items[])
    const visaRequirement = visaRequirementsSteps?.Items?.[0];

    // Sort steps by ascending order
    const visaSteps =
        [...(visaRequirement?.visaRequirementsDTOs ?? [])]
            .sort((a, b) => a.step - b.step)
            .map((item) => ({
                step: item.step,
                label: item.visaStatusName,
                completed: item.visaRequirementStatus === 1,
                status: item.visaRequirementStatus,
            }));

    const totalSteps = visaSteps.length;
    const currentStep = visaSteps.filter((x) => x.completed).length;

    const percentage =
        totalSteps > 0
            ? Math.round((currentStep / totalSteps) * 100)
            : 0;

    const currentStepLabel =
        currentStep > 0
            ? visaSteps[currentStep - 1]?.label
            : "Not Started";

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Visa Processing Status
            </h3>

            {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                    Loading visa processing status...
                </div>
            ) : totalSteps === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No visa processing steps available.
                </div>
            ) : (
                <>
                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>{currentStepLabel}</span>
                            <span>{percentage}% Complete</span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="flex justify-between items-start gap-4 mt-6 overflow-x-auto">
                        {visaSteps.map((step) => (
                            <div
                                key={step.step}
                                className="flex flex-col items-center text-center min-w-[120px] flex-1"
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${step.completed
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                        }`}
                                >
                                    {step.completed ? (
                                        <svg
                                            className="w-5 h-5"
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
                                        <span className="text-sm font-semibold">
                                            {step.step}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {step.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default VisaProcessingStatusForm;