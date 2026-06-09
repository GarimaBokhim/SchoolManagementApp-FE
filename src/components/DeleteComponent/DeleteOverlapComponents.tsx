"use client";

import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: (id: string) => Promise<void> | void;
    id: string;
    title?: string;
    description?: string;
}

const DeleteOverlapComponents = ({
    visible,
    onClose,
    onConfirm,
    id,
    title,
    description
}: Props) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!visible) return;

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [visible, onClose]);

    if (!visible) return null;

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm(id);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-lg">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-red-100 text-red-600">
                            <Trash2 size={18} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {title}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t p-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 flex items-center gap-2"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteOverlapComponents;