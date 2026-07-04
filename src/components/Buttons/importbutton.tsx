import { useState } from 'react'
import { Import, X } from 'lucide-react'
import { ImportExcel } from './importexcelbutton'
type Props = {
  handleExcelImport?: (data: File) => Promise<void>
}
const ImportButtonForm = ({ handleExcelImport }: Props) => {
  const [showModal, setShowModal] = useState(false)
  const onClose = () => {
    setShowModal(!showModal)
  }
  return (
    <div>
      <button
        onClick={() => onClose()}
        className=" text-white rounded-md !text-xs font-bold !bg-teal-500 !p-[0.4rem] cursor-pointer"
      >
        <Import size={19} />
      </button>

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
              Choose Import Format
            </h2>

            <div className="flex justify-around items-center">
              <div className="cursor-pointer text-center hover:scale-105 transition-transform">
                <ImportExcel
                  onImport={async (data) => {
                    if (handleExcelImport) {
                      try {
                        await handleExcelImport(data)
                      } finally {
                        setShowModal(false)
                      }
                    }
                  }}
                />
                <p className="mt-2 font-medium">Excel</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImportButtonForm
