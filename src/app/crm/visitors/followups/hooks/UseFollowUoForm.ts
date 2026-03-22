// src/app/crm/applications/followups/hooks/useFollowUpFilters.ts

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FollowUpFilterFormData, SearchParam } from '../types/IFollowUps'

export const useFollowUpFilters = (
  setParams: (params: string) => void,
  setPaginationParams: (updater: (prev: SearchParam) => SearchParam) => void
) => {
  const [openFilter, setOpenFilter] = useState(false)

  const filterForm = useForm<FollowUpFilterFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
    },
  })

  const handleFilterSubmit = (formData: FollowUpFilterFormData) => {
    const queryParams = [
      formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
      formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
    ]
      .filter(Boolean)
      .join('&')

    const fullQuery = queryParams ? `&${queryParams}` : ''
    setParams(fullQuery)
    setPaginationParams((prev: SearchParam) => ({ ...prev, pageIndex: 1 }))
  }

  const onClearClick = () => {
    setParams('')
    filterForm.reset()
    setPaginationParams((prev: SearchParam) => ({ ...prev, pageIndex: 1 }))
  }

  return {
    openFilter,
    setOpenFilter,
    filterForm,
    handleFilterSubmit,
    onClearClick,
  }
}