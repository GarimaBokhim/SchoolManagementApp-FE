import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import excelIcon from "../../../public/assets/excel.png";

type Props = {
  file?: string;
};

export const DownloadTemplateCSV = ({ file }: Props) => {
  const [excelBlobUrl, setExcelBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndConvertExcel = async () => {
      if (!file) return;

      try {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = URL.createObjectURL(blob);
        setExcelBlobUrl(url);
      } catch (error) {
        console.error("Failed to load or convert Excel file:", error);
      }
    };

    fetchAndConvertExcel();
  }, [file]);

  const handleDownload = () => {
    if (!excelBlobUrl) return;

    const a = document.createElement("a");
    a.href = excelBlobUrl;
    a.download = "template.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="cursor-pointer" onClick={handleDownload}>
      <div className="tooltip">
        <img
          src={excelIcon.src}
          alt="Download Template"
          className="w-20 h-20 mx-auto"
        />
      </div>
    </div>
  );
};