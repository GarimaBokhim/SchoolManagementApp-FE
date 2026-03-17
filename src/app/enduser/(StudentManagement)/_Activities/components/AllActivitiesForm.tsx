'use client'

import { useRef, useState } from 'react'
import { Filter, Plus, RotateCcw } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import toast, { Toaster } from 'react-hot-toast'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useFilterActivity, useGetAllEvents } from '../hooks'
import { Activity, IFilterActivityByDate } from '../types/IActivities'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import AddActivityModal from './AddActivitiesModel'

const ACTIVITY_CATEGORY_LABELS: Record<number, string> = {
  0: 'Sports', 1: 'Arts', 2: 'Music', 3: 'Other',
}

const AllActivityForm = () => {
  const { menuStatus } = usePermissions()
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10, pageIndex: 1, isPagination: true,
  })
  type SearchParam = { pageSize: number; pageIndex: number; isPagination: boolean }

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize
    setPaginationParams(params)
  }

  const [openFilter, setOpenFilter] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [params, setParams] = useState('')
  const formRef = useRef<DateRangeFilterRef>(null)
  const { handleError, clearError } = useErrorHandler()

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
  const fullQuery = query + (params || '')

  const form = useForm<IFilterActivityByDate>({
    defaultValues: { startDate: '', endDate: '' },
  })

  const handleSubmitForm = useForm<SearchParam>({ defaultValues: {} })

  const { data: filteredActivity, refetch, isLoading } = useFilterActivity(fullQuery)

  // ✅ Event lookup map
  const { data: events = [] } = useGetAllEvents()
  const eventMap = Object.fromEntries(events.map((e) => [e.id, e.title]))

  const onSubmit: SubmitHandler<IFilterActivityByDate> = async (formData) => {
    clearError()
    try {
      const queryParams = [
        formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
        formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
      ]
        .filter(Boolean)
        .join('&')
      const fullQuery = queryParams ? `&${queryParams}` : ''
      await toast.promise(
        (async () => {
          setParams(fullQuery)
          await refetch()
        })(),
        { loading: 'Fetching data...', success: 'Data fetched successfully!' }
      )
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
    }
  }

  const onClearClick = () => {
    setParams('')
    formRef.current?.handleClear()
    form.reset()
    refetch()
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Activities</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={24} />}
                  type="button"
                  text="Add New Activity"
                  onClick={() => setAddModal(true)}
                  className="!text-md !font-bold"
                />
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {openFilter && (
            <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />
                <div className="flex gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3 text-left">Activity Name</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Event</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center w-[180px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Loading Activities...
                    </td>
                  </tr>
                ) : filteredActivity?.Items && filteredActivity.Items.length > 0 ? (
                  filteredActivity.Items.map((activity: Activity, index: number) => (
                    <tr
                      key={activity.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4 font-medium">{activity.name}</td>
                      <td className="py-2 px-4 hidden md:table-cell">
                        {ACTIVITY_CATEGORY_LABELS[activity.activityCategory] ?? activity.activityCategory}
                      </td>

                      {/* ✅ Event name instead of ID */}
                      <td className="py-2 px-4 hidden lg:table-cell">
                        {eventMap[activity.eventId] ?? activity.eventId}
                      </td>

                      <td className="py-2 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {activity.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex justify-center gap-2">
                          {canEdit && (
                            <ButtonElement
                              type="button"
                              text="Edit"
                              className="!text-xs !bg-teal-500 hover:!bg-teal-600"
                              onClick={() => Toast.info('Edit coming soon!')}
                            />
                          )}
                          {canDelete && (
                            <ButtonElement
                              type="button"
                              text="Delete"
                              className="!text-xs !bg-red-500 hover:!bg-red-600"
                              onClick={() => Toast.info('Delete coming soon!')}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500 italic">
                      No activities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredActivity?.Items && filteredActivity.Items.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={handleSubmitForm}
              pagination={{
                currentPage: filteredActivity?.PageIndex ?? 1,
                firstPage: filteredActivity?.FirstPage ?? 1,
                lastPage: filteredActivity?.LastPage ?? 1,
                nextPage: filteredActivity?.NextPage ?? 1,
                previousPage: filteredActivity?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>

      <AddActivityModal
        visible={addModal}
        onClose={() => setAddModal(false)}
        onSuccess={() => {
          setAddModal(false)
          refetch()
        }}
      />
    </>
  )
}

export default AllActivityForm