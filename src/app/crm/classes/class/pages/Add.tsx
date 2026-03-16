type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const AddClassModal = ({ isOpen, onClose, onSuccess }: Props) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#353535] rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Add Class</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>
       
        <p className="text-sm text-gray-500">Form coming soon...</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSuccess}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddClassModal