import { ChangeEvent, useRef } from "react";
import excelIcon from "../../../public/assets/excel.png";

interface ImportExcelProps {
  onImport: (file: File, data: unknown[]) => void;
}

export const ImportExcel = ({ onImport }: ImportExcelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImport(file, []);
  };

  return (
    <div className="mx-2 tooltip">
      <img
  src={excelIcon.src}
  alt="Import Excel"
  className="w-20 h-20 mx-auto"
  onClick={handleImageClick}
/>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};