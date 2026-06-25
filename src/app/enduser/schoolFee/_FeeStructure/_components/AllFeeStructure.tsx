'use client'
import { useEffect, useRef, useState } from 'react'
import {
  IFilterFeeStructure,
  IFeeStructure,
  FeePaidType,
} from '../types/IFeeStructure'
import { SubmitHandler, useForm } from 'react-hook-form'
import Pagination from '@/components/Pagination'
import React from 'react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import toast, { Toaster } from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { Filter, Plus, RotateCcw, Trash, Pencil } from 'lucide-react'
import DateRangeFilter, {
  DateRangeFilterRef,
} from '@/components/DateFilter/FilterComponent'
import { useFilterFeeStructureByDate, useRemoveFeeStructure } from '../hooks'
import { AppCombobox } from '@/components/Input/ComboBox'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import AddFeeStructure from '../pages/Add'
import UpdateFeeStructure from '../pages/Edit'
import { useGetAllClass } from '@/app/enduser/(Academics)/Class/hooks'
import DeleteButton from '@/components/Buttons/DeleteButton'

const AllFeeStructureForm = () => {
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  })

  type SearchParam = {
    pageSize: number
    pageIndex: number
    isPagination: boolean
  }

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize
    setPaginationParams(params)
  }

  const [addModal, setAddModal] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [selectedFeeStructure, setSelectedFeeStructure] =
    useState<IFeeStructure | null>(null)

  const { menuStatus } = usePermissions()
  const { canAdd, canDelete, canEdit } = useMenuPermissionData(menuStatus)
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
  const [params, setParams] = useState('')
  const { data: allClass } = useGetAllClass()
  const [selectedClassId, setSelectedClassId] = useState<string | null>('')
  const fullQuery = query + (params || '')

  const {
    data: filteredFeeStructure,
    refetch,
    isLoading,
  } = useFilterFeeStructureByDate(fullQuery)

  useEffect(() => {
    refetch()
  }, [paginationParams, refetch])

  const form = useForm<IFilterFeeStructure>({
    defaultValues: {
      classId: '',
      startDate: '',
      endDate: '',
    },
  })

  const { handleError, clearError } = useErrorHandler()
  const [openFilter, setOpenFilter] = useState(false)

  const onSubmit: SubmitHandler<IFilterFeeStructure> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        formData.classId
          ? `classId=${encodeURIComponent(formData.classId)}`
          : null,
        formData.startDate
          ? `startDate=${encodeURIComponent(formData.startDate)}`
          : null,
        formData.endDate
          ? `endDate=${encodeURIComponent(formData.endDate)}`
          : null,
      ]
        .filter(Boolean)
        .join('&')
      const fullQuery = queryParams ? `&${queryParams}` : ''
      await toast.promise(
        (async () => {
          setParams(fullQuery)
          await refetch()
        })(),
        {
          loading: 'Fetching data...',
          success: 'Data fetched successfully!',
        }
      )
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
      console.error('Error during form submission:', error)
    }
  }

  const refForInput = useRef<HTMLInputElement>(null)
  useEffect(() => {
    refForInput.current?.focus()
  }, [])

  const formRef = useRef<DateRangeFilterRef>(null)
  const deleteFeeStructure = useRemoveFeeStructure()

  const handleDelete = async (id: string) => {
    try {
      await deleteFeeStructure.mutateAsync(id)
      toast.success('Fee structure deleted successfully!')
      refetch()
    } catch {
      toast.error('Error deleting fee structure.')
    }
  }

  const handleEdit = (feeStructure: IFeeStructure) => {
    setSelectedFeeStructure(feeStructure)
    setUpdateModal(true)
  }

  const handleCloseUpdateModal = () => {
    setUpdateModal(false)
    setSelectedFeeStructure(null)
    refetch()
  }

  const onClearClick = () => {
    refetch()
    setParams('')
    setSelectedClassId('')
    formRef.current?.handleClear()
    form.reset()
  }

  // Helper function to get class name by ID
  const getClassName = (classId: string) => {
    const classItem = allClass?.Items?.find((i) => i.id === classId)
    return classItem?.name || 'N/A'
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Fee Structure</h1>
            <div className="flex flex-wrap gap-2 justify-end">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={18} />}
                  type="button"
                  text="Add New"
                  onClick={() => setAddModal(true)}
                  className="!font-semibold"
                />
              )}
            </div>
          </div>

          {openFilter && (
            <div className="bg-white dark:bg-[#2c2c2c] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col lg:flex-row lg:flex-wrap gap-4"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />
                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedClassId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Class"
                    name="classId"
                    form={form}
                    options={allClass?.Items}
                    selected={
                      allClass?.Items?.find((g) => g.id === selectedClassId) ||
                      null
                    }
                    onSelect={(group) => {
                      setSelectedClassId(group?.id ?? null)
                    }}
                    getLabel={(g) => g?.name ?? ''}
                    getValue={(g) => g?.id ?? ''}
                  />
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0 lg:ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600"
                  />
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#80878c] text-gray-700 dark:text-white uppercase font-semibold border-b border-gray-200">
                  <th className="px-4 py-3">S.N</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Paid Types</th>
                  <th className="px-4 py-3">Fee Category Name</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Discount Amount</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-center text-gray-500 dark:text-gray-300"
                    >
                      Loading Fee Structure...
                    </td>
                  </tr>
                ) : filteredFeeStructure?.Items?.length ? (
                  filteredFeeStructure.Items.map(
                    (feeStructure: IFeeStructure, index: number) => (
                      <tr
                        key={feeStructure.id || index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100"
                      >
                        <td className="py-3 px-4">
                          {(paginationParams.pageIndex - 1) *
                            paginationParams.pageSize +
                            index +
                            1}
                        </td>
                        <td className="py-3 px-4">
                          {getClassName(feeStructure.classId)}
                        </td>
                        <td className="py-3 px-4">
                          {feeStructure.paidTypes
                            ? FeePaidType[feeStructure.paidTypes]
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {feeStructure.feeCategoryName || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {feeStructure.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-3 px-4">
                          {feeStructure.discountAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2 flex-wrap">
                            {canEdit && (
                              <ButtonElement
                                text=""
                                icon={
                                  <Pencil className="text-white" size={15} />
                                }
                                onClick={() => handleEdit(feeStructure)}
                                className="!bg-blue-500 hover:!bg-blue-600"
                              />
                            )}
                            {canDelete && (
                              <DeleteButton
                                onConfirm={() =>
                                  handleDelete(
                                    feeStructure.id ? feeStructure.id : ''
                                  )
                                }
                                headerText={<Trash />}
                                content="Are you sure you want to delete this Fee Structure?"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No Fee Structure found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredFeeStructure && filteredFeeStructure?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: filteredFeeStructure?.PageIndex ?? 1,
                firstPage: filteredFeeStructure?.FirstPage ?? 1,
                lastPage: filteredFeeStructure?.LastPage ?? 1,
                nextPage: filteredFeeStructure?.NextPage ?? 1,
                previousPage: filteredFeeStructure?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}

        <AddFeeStructure
          visible={addModal}
          onClose={() => {
            setAddModal(false)
            refetch()
          }}
        />

        <UpdateFeeStructure
          visible={updateModal}
          onClose={handleCloseUpdateModal}
          feeStructure={selectedFeeStructure}
        />
      </div>
    </>
  )
}

export default AllFeeStructureForm
