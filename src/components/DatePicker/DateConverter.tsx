import { useDate } from "@/context/auth/PrimaryDateContext";
import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";
import { useState, useEffect } from "react";

type Props = {
  date?: string;
};

const DateConverter = ({ date }: Props) => {
  const [convertedDate, setConvertedDate] = useState("");
  const { isPrimaryBS } = useDate();

  useEffect(() => {
    if (!date || date.trim() === "") {
      setConvertedDate("");
      return;
    }

    const newDate = date.split("T")[0];
    const year = parseInt(newDate.split("-")[0], 10);

    if (isPrimaryBS && newDate) {
      if (year >= 2000 && year <= 2050) {
        const bsDate = adToBs(newDate);
        setConvertedDate(bsDate || "");
      } else {
        setConvertedDate(newDate);
      }
    } else {
      if (newDate) {
        if (year >= 2070 && year <= 3000) {
          const adDate = bsToAd(newDate);
          setConvertedDate(adDate || "");
        } else {
          setConvertedDate(newDate);
        }
      } else {
        setConvertedDate("");
      }
    }
  }, [date, isPrimaryBS]);

  if (!convertedDate) return null;

  return <div>{convertedDate}</div>;
};

export default DateConverter;
