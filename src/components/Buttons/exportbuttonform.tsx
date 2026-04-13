import { JSX, useState } from "react";
import { X } from "lucide-react";
import exportFile from "../../../public/assets/export.png";
import { DownloadTemplateCSV } from "./CSVButton";
import { ExportExcelButton } from "./ExportExcelbutton";
import { PdfButton } from "./PdfButton";
type Props = {
  file?: string;
  data?: JSX.Element;
  excelData?: JSX.Element;
   onExcelExport?: () => void;
};
const ExportButtonForm = ({ data, excelData, file }: Props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="tooltip">
        <button
          onClick={() => setShowModal(true)}
          className=" text-white rounded-md !text-xs font-bold !bg-teal-500 !p-[0.4rem] mx"
        >
          <img
            src={exportFile.src}
            className="h-[1.2rem]  top-2 right-2 cursor-pointer flex justify-center"
          />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-6 text-center">
              Choose Export Format
            </h2>

            <div className="flex justify-around items-center">
              {file && (
                <div className="cursor-pointer text-center hover:scale-105 transition-transform">
                  <DownloadTemplateCSV file={file} />
                  <p className="mt-2 font-medium">Template</p>
                </div>
              )}

              <div className="cursor-pointer text-center hover:scale-105 transition-transform">
                <PdfButton data={data} />
                <p className="mt-2 font-medium">PDF</p>
              </div>
              <div className="cursor-pointer text-center hover:scale-105 transition-transform">
                <ExportExcelButton data={excelData} />
                <p className="mt-2 font-medium">Excel</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButtonForm;