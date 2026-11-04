
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { ExcelPreviewModalProps } from "../types/IExcelPreviee";

const ExcelPreviewModal = ({
  previewData,
  show,
  onClose,
  onSave,
  loading,
}: ExcelPreviewModalProps) => {
  if (!show) return null;

  const headers = previewData.length > 0
    ? Object.keys(previewData[0])
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3">
      <div className="w-[95%] max-w-7xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl dark:bg-[#353535]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Preview Excel Data
          </h2>

          <span className="rounded-md bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
            Total Students: {previewData.length}
          </span>
        </div>

        {/* Table */}
        <div className="max-h-[65vh] overflow-auto">
          <table className="w-full border-collapse text-sm">

            {/* Table Header */}
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-[#80878c]">
              <tr className="text-center text-xs font-semibold uppercase text-gray-700 dark:text-white">
                {headers.map((key) => (
                  <th
                    key={key}
                    className="whitespace-nowrap border border-gray-200 px-4 py-3 text-center align-middle dark:border-gray-600"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {previewData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 text-center transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-[#454545]"
                >
                  {headers.map((key) => (
                    <td
                      key={key}
                      className="whitespace-nowrap border border-gray-100 px-4 py-3 text-center align-middle text-gray-700 dark:border-gray-600 dark:text-gray-200"
                    >
                      {row[key] !== null && row[key] !== undefined
                        ? String(row[key])
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>

          {previewData.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No Excel records found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-600">
          <ButtonElement
            text="Cancel"
            onClick={onClose}
            disabled={loading}
          />

          <ButtonElement
            text={loading ? "Saving..." : "Save"}
            onClick={onSave}
            disabled={loading}
          />
        </div>

      </div>
    </div>
  );
};

export default ExcelPreviewModal;
