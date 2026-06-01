"use client";

import { useState, useRef } from "react";

type TooltipProps = {
    children: React.ReactNode;
    text: string;
    position?: "top" | "bottom" | "left" | "right";
    delay?: number;
};

export const Tooltip = ({
    children,
    text,
    position = "top",
    delay = 300,
}: TooltipProps) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    const positionClasses = {
        top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
        bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
        left: "right-full mr-2 top-1/2 -translate-y-1/2",
        right: "left-full ml-2 top-1/2 -translate-y-1/2",
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}

            {visible && (
                <div
                    role="tooltip"
                    className={`absolute z-50 px-2 py-1 text-[11px] rounded bg-gray-900 text-white shadow-md whitespace-nowrap ${positionClasses[position]} transition-opacity`}
                >
                    {text}
                </div>
            )}
        </div>
    );
};