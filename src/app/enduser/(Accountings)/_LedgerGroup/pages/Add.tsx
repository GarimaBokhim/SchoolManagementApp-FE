import { useForm } from 'react-hook-form'
import type { ILedgerGroup } from '../types/ILedgerGroup'
import { useEffect } from 'react'
import AddLedgerForm from '../components/AddLedgerGroup'
import { yupResolver } from '@hookform/resolvers/yup'
import { LedgerValidator } from '../validators'

interface Props {
  visible: boolean
  onClose?: () => void
  selectedMaster?: string
}

const AddLedger = ({ visible, onClose, selectedMaster }: Props) => {
  const form = useForm<ILedgerGroup>({
    resolver: yupResolver(LedgerValidator),
    defaultValues: {
      id: '',
      name: '',
      masterId: '',
    },
  })

  useEffect(() => {
    if (visible) {
      form.reset({
        id: '',
        name: '',
        masterId: '',
      })
    }
  }, [visible, form])

  const handleFormClose = () => {
    form.reset()
    if (onClose) onClose()
  }

  if (!visible) return null

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center z-50
    bg-black bg-opacity-50 dark:bg-[#303135] bg-opacity-50 sm:left-[5%] md:left-[24%] lg:left-[12.3%]
    `}
    >
      <div
        className={`bg-[#FBFBFB] border rounded-xl   dark:bg-[#27272a]
        transition-all duration-300 ease-in-out
        w-[55%] h-[54%] overflow-y-auto 
        flex flex-col`}
      >
        <AddLedgerForm
          form={form}
          onClose={handleFormClose}
          selectedMaster={selectedMaster}
        />
      </div>
    </div>
  )
}

export default AddLedger
