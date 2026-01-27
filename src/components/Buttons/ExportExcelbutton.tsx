import { ReactNode, useRef } from "react";
import * as XLSX from "xlsx";
import exportIcon from "../../../public/assets/excel.png";
import { ButtonElement } from "./ButtonElement";

interface Props {
  children: ReactNode;
  fileName?: string;
}

export const ExportExcelButton = ({
  children,
  fileName = "export.xlsx",
}: Props) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (!tableRef.current) return;

    const table = tableRef.current.querySelector("table");
    if (!table) {
      console.warn("No table found to export.");
      return;
    }

    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="mx-2 tooltip">
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          visibility: "hidden",
        }}
      >
        <div ref={tableRef}>{children}</div>
      </div>

      <ButtonElement
        type="button"
        text=""
        icon={<img src={exportIcon.src} className="w-20 h-20 mx-auto" />}
        onClick={handleExport}
        className="!text-xs font-bold !bg-white !p-[0.4rem]"
      />
    </div>
  );
};
