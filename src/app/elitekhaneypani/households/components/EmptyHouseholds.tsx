import { Home } from "lucide-react";

interface Props {
    message?: string;
}

export const EmptyHouseholds = ({ message = "No households found yet." }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
            <Home size={40} className="text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    );
};

export default EmptyHouseholds;
