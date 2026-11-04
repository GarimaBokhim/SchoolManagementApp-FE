
import { useDate } from "@/context/auth/PrimaryDateContext";
import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";
import { useMemo } from "react";

type Props = {
  date?: string;
};

const DateConverter = ({ date }: Props) => {
  const { isPrimaryBS } = useDate();

  const convertedDate = useMemo(() => {
    if (!date?.trim()) return "";

    let newDate = "";

    // Handle backend format: 7/14/2083 12:00:00 AM
    if (date.includes("/")) {
      const datePart = date.split(" ")[0];
      const [month, day, year] = datePart.split("/");

      if (!month || !day || !year) return "";

      newDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } else {
      // Handle ISO format: YYYY-MM-DDTHH:mm:ss
      newDate = date.split("T")[0];
    }

    const year = Number(newDate.split("-")[0]);

    if (!year || !newDate) return "";

    if (isPrimaryBS) {
      if (year >= 2000 && year <= 2050) {
        return adToBs(newDate) || "";
      }

      return newDate;
    }

    if (year >= 2070 && year <= 3000) {
      return bsToAd(newDate) || "";
    }

    return newDate;
  }, [date, isPrimaryBS]);

  if (!convertedDate) return null;

  return <div>{convertedDate}</div>;
};

export default DateConverter;
