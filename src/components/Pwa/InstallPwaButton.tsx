"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPwaButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const handler = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    if (!deferredPrompt || dismissed) return null;

    const handleInstall = async () => {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-[#035BBA] pl-4 pr-2 py-2 text-white shadow-lg">
            <button
                type="button"
                onClick={handleInstall}
                className="flex items-center gap-2 text-sm font-medium cursor-pointer"
            >
                <Download size={16} />
                Install EliteKhaneyPani
            </button>
            <button
                type="button"
                aria-label="Dismiss install prompt"
                onClick={() => setDismissed(true)}
                className="rounded-full p-1 hover:bg-white/20 cursor-pointer"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default InstallPwaButton;
