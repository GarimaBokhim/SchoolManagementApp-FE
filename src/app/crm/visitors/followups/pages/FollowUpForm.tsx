
'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { SearchParam } from '../types/IFollowUps'
import { useFollowUps } from '../hooks/UseFollowUps'
import { useFollowUpMutations } from '../hooks/UseFollowMutation'
import { FollowUpHeader } from '../components/FollowUpHeader'
import { FollowUpFilter } from '../components/FollowUpFilter'
import { FollowUpTable } from '../components/FollowUpTable'
import AddFollowUpModal from '../components/AddFollowUpModel'
import { useFollowUpFilters } from '../hooks/UseFollowUoForm'

const AllFollowUpsForm = () => {
  const dateFilterRef = useRef<DateRangeFilterRef>(null)

  const paginationForm = useForm<SearchParam>({
    defaultValues: {
      pageSize: 10,
      pageIndex: 1,
      isPagination: true,
    },
  })

  const {
    followUps,
    loading,
    error,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    setParams,
    fetchFollowUps,
  } = useFollowUps()

  const {
    openFilter,
    setOpenFilter,
    filterForm,
    handleFilterSubmit,
    onClearClick,
  } = useFollowUpFilters(setParams, setPaginationParams)

  // mutations used inside AddFollowUpModal via fetchFollowUps
  useFollowUpMutations(fetchFollowUps)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleSearch = (searchParams: SearchParam) => {
    searchParams.pageSize = paginationParams.pageSize
    setPaginationParams(searchParams)
  }

  const handleAddSuccess = () => {
    fetchFollowUps()
    setIsAddModalOpen(false)
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Toaster position="top-right" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <FollowUpHeader
            onToggleFilter={() => setOpenFilter(!openFilter)}
            onAddNew={() => setIsAddModalOpen(true)}
          />

          {openFilter && (
            <FollowUpFilter
              openFilter={openFilter}
              filterForm={filterForm}
              dateFilterRef={dateFilterRef}
              onFilterSubmit={handleFilterSubmit}
              onClear={onClearClick}
              setParams={setParams}
            />
          )}

          <FollowUpTable
            followUps={followUps}
            loading={loading}
            currentPage={currentPage}
            pageSize={paginationParams.pageSize}
          />

          <AddFollowUpModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={handleAddSuccess}
            fetchFollowUps={fetchFollowUps}
          />
        </div>

        {!loading && followUps.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={paginationForm}
              pagination={{
                currentPage: currentPage,
                firstPage: 1,
                lastPage: totalPages,
                nextPage: currentPage < totalPages ? currentPage + 1 : currentPage,
                previousPage: currentPage > 1 ? currentPage - 1 : 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default AllFollowUpsForm