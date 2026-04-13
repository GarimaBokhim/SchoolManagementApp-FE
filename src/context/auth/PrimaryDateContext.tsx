"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type DateType = "ad" | "bs";

interface DateContextType {
  dateType: DateType;
  setDateType: (value: DateType) => void;
  isPrimaryBS: boolean;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  // ✅ Lazy initialization (no extra render)
  const [dateType, setDateType] = useState<DateType>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("dateType") as DateType) ?? "bs";
    }
    return "bs";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dateType", dateType);
      document.documentElement.classList.toggle("ad", dateType === "ad");
    }
  }, [dateType]);

  return (
    <DateContext.Provider
      value={{
        dateType,
        setDateType,
        isPrimaryBS: dateType === "bs",
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within DateProvider");
  }
  return context;
};

export const useIsPrimary = () => useDate().isPrimaryBS;
