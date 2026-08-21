"use client";

import { useEffect } from "react";

export const ServiceWorkerRegister = () => {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!("serviceWorker" in navigator)) return;

        navigator.serviceWorker
            .register("/sw.js")
            .catch((err) => console.error("Service worker registration failed:", err));
    }, []);

    return null;
};

export default ServiceWorkerRegister;
