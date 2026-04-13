'use client'

import { useForm } from 'react-hook-form'
import { IHistory } from '../types/IHistory'
import { useGetHistoryById } from '../hooks'
import EditHistoryForm from '../_components/EditItemhistory'

interface Props {
  visible: boolean
  onClose: () => void
  historyId: string
}

const EditItemHistory = ({ visible, onClose, historyId }: Props) => {
  const { data: historyData } = useGetHistoryById(historyId)

  const form = useForm<IHistory>({
    defaultValues: {
      schoolItemId: historyData?.schoolItemId ?? '',
      previousStatus: historyData?.previousStatus ?? 0,
      currentStatus: historyData?.currentStatus ?? 0,
      remarks: historyData?.remarks ?? '',
    },
  })

  if (!visible) return null

  return <EditHistoryForm form={form} onClose={onClose} historyId={historyId} />
}

export default EditItemHistory
