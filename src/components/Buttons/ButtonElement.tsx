import React from "react";
import { Spinner } from "../ui/shadcn-io/spinner";

interface PropsT {
  disabled?: boolean;
  text?: string;
  onClick?: () => void;
  handleClick?: () => void;
  isLoading?: boolean;
  type?: "submit" | "reset" | "button";
  customStyle?: string;
  className?: string;
  style?: React.CSSProperties; // i have added this for crm styling and it is optional so nothing to worry about for the use in the school management (nimesh)
  icon?: any;
}

export const ButtonElement = ({
  isLoading,
  text,
  type,
  onClick,
  disabled,
  handleClick,
  customStyle,
  icon,
  className,
  style, // ✅ destructured
}: PropsT) => {
  const buttonIcon = isLoading ? (
    <Spinner key={"circle"} variant={"circle"} />
  ) : null;

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={handleClick || onClick}
      style={style} // ✅ applied
      className={`px-3 py-2 text-sm font-medium text-white rounded-md ${className} ${customStyle} transition ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#035BBA] hover:bg-[#4788CD]"
      }`}
    >
      <div className="flex items-center justify-center">
        {icon} &nbsp;
        {buttonIcon}
        {`${text}`}
      </div>
    </button>
  );
};