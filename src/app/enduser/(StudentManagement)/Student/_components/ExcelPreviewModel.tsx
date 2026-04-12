import { ButtonElement } from "@/components/Buttons/ButtonElement"
import { ExcelPreviewModalProps } from '../types/IExcelPreviee'



const ExcelPreviewModal = ({
  previewData,
  show,
  onClose,
  onSave,
  loading
}: ExcelPreviewModalProps) => {

  if (!show) return null

  const headers = previewData.length > 0 ? Object.keys(previewData[0]) : []

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[95%] max-h-[85%] overflow-auto">

        <h2 className="text-lg font-semibold mb-4">Preview Excel Data</h2>

        <div className="overflow-auto max-h-[400px] border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((key) => (
                  <th key={key} className="px-3 py-2 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {previewData.map((row, index) => (
                <tr key={index}>
                  {headers.map((key) => (
                    <td key={key} className="px-3 py-2">
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <ButtonElement text="Cancel" onClick={onClose} />

          <ButtonElement
            text={loading ? "Saving..." : "Save"}
            onClick={onSave}
          />
        </div>
      </div>
    </div>
  )
}

export default ExcelPreviewModal