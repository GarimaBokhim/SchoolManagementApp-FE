export const HouseholdListSkeleton = () => {
    return (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4"
                >
                    <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="mt-2 h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="mt-4 space-y-2">
                        <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HouseholdListSkeleton;
