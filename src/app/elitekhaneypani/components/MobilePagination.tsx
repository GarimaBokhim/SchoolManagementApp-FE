import { ButtonElement } from "@/components/Buttons/ButtonElement";

interface MobilePaginationProps {
    pageIndex: number;
    lastPage: number;
    onChange: (page: number) => void;
}

export const MobilePagination = ({ pageIndex, lastPage, onChange }: MobilePaginationProps) => {
    return (
        <div className="flex items-center justify-center gap-3 pt-2">
            <ButtonElement
                type="button"
                text="Previous"
                disabled={pageIndex <= 1}
                handleClick={() => onChange(Math.max(1, pageIndex - 1))}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {pageIndex} of {lastPage}
            </span>
            <ButtonElement
                type="button"
                text="Next"
                disabled={pageIndex >= lastPage}
                handleClick={() => onChange(Math.min(lastPage, pageIndex + 1))}
            />
        </div>
    );
};
