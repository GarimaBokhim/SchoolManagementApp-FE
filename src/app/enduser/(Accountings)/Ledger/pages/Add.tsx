import { useForm } from 'react-hook-form'
import type { ILedgers } from '../types/ILedgers'
import { useEffect } from 'react'
import AddLedgerForm from '../components/AddLedger'
import { yupResolver } from '@hookform/resolvers/yup'
import { LedgerValidator } from '../validators'

interface Props {
  visible: boolean
  onClose?: () => void

  selectedSubLedgerGroup?: string
}

const AddL = ({ visible, onClose, selectedSubLedgerGroup }: Props) => {
  const form = useForm<ILedgers>({
    resolver: yupResolver(LedgerValidator),
    defaultValues: {
      id: '',
      name: '',
      address: '',
      panNo: '',
      phoneNumber: '',
      maxCreditPeriod: '',
      maxDuePeriod: '',
      openingBalance: null,
      subledgerGroupId: '',
    },
  })

  useEffect(() => {
    if (visible) {
      form.reset({
        id: '',
        name: '',
        address: '',
        panNo: '',
        phoneNumber: '',
        maxCreditPeriod: '',
        openingBalance: null,
        maxDuePeriod: '',
        subledgerGroupId: '',
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
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
      >
        <AddLedgerForm
          form={form}
          onClose={handleFormClose}
          selectedSubLedgerGroup={selectedSubLedgerGroup}
        />
      </div>
    </div>
  )
}

export default AddL
