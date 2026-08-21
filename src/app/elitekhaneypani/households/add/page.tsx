"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { HouseholdForm } from "../components/HouseholdForm";

export default function AddHouseholdPage() {
    const router = useRouter();

    return (
        <div className="p-4 pb-24 space-y-4">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Go back"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Add Household</h1>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4">
                <HouseholdForm onSuccess={() => router.push("/elitekhaneypani/households")} />
            </div>
        </div>
    );
}
