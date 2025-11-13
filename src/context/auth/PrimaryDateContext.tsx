"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Date = "ad" | "bs";
interface DateContextType {
  dateType: Date;
  setDateType: (Date: Date) => void;
  isPrimaryBS: boolean;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [dateType, setDateType] = useState<Date>("bs");

  const setDate = (newDate: Date) => {
    setDateType(newDate);
    localStorage.setItem("dateType", newDate);
    document.documentElement.classList.toggle("ad", newDate === "ad");
  };

  useEffect(() => {
    const storedDate = (localStorage.getItem("dateType") as Date) || "bs";
    setDate(storedDate);
  }, []);

  return (
    <DateContext.Provider
      value={{ dateType, setDateType, isPrimaryBS: dateType === "bs" }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) throw new Error("useDate must be used within DateProvider");
  return context;
};
export const useIsPrimary = () => useDate().isPrimaryBS;
