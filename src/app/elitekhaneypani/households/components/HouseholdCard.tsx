import { Droplets, MapPin, Phone, Users } from "lucide-react";
import { Household } from "../types/household.types";

interface Props {
    household: Household;
}

export const HouseholdCard = ({ household }: Props) => {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {household.consumerName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Meter #{household.meterNumber || "N/A"}
                    </p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950 px-2 py-1 text-xs font-medium text-[#035BBA] dark:text-blue-300">
                    <Droplets size={12} />
                    Ward {household.wardNumber}
                </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{household.tole || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={14} className="shrink-0" />
                    <span>{household.familyMember} family member(s)</span>
                </div>
                {household.contactNumber && (
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="shrink-0" />
                        <span>{household.contactNumber}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HouseholdCard;
