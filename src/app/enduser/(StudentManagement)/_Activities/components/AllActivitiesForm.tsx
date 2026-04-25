'use client'

import { useRef, useState } from 'react'
import { Filter, Plus, RotateCcw, Edit, Trash } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import toast, { Toaster } from 'react-hot-toast'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import { useFilterActivity, useGetAllEvents, useDeleteActivity } from '../hooks'
import { Activity, IFilterActivityByDate } from '../types/IActivities'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import AddActivityModal from './AddActivitiesModel'
import DeleteButton from '@/components/Buttons/DeleteButton'
import EditActivityModal from './EditActivityModel'

const ACTIVITY_CATEGORY_LABELS: Record<number, string> = {
  0: 'Sports',
  1: 'Academics',
  2: 'Creative Arts',
  3: 'Environmental',
  4: 'Performing Arts',
  5: 'Technical',
  6: 'Social Services',
  7: 'Vocational',
}

const AllActivityForm = () => {
  const { menuStatus } = usePermissions()
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

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

  const [openFilter, setOpenFilter] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
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
  const { data: events = [] } = useGetAllEvents()
  const { mutateAsync: deleteActivity } = useDeleteActivity()

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

  const handleDelete = async (id: string) => {
    await toast.promise(
      deleteActivity(id),
      {
        loading: 'Deleting activity...',
        success: 'Activity deleted successfully!',
        error: 'Error deleting activity.',
      }
    )
  }

  const handleEditClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setEditModal(true)
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
                  <th className="px-4 py-3 text-center w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                      Loading Activities...
                    </td>
                  </tr>
                ) : filteredActivity?.Items && filteredActivity.Items.length > 0 ? (
                  filteredActivity.Items.map((activity: Activity, index: number) => (
                    <tr
                      key={activity.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="px-4 py-3 text-left">
                        {((filteredActivity?.PageIndex - 1) * paginationParams.pageSize) + index + 1}
                      </td>
                      <td className="px-4 py-3 text-left font-medium">
                        {activity.name}
                      </td>
                      <td className="px-4 py-3 text-left hidden md:table-cell">
                        {ACTIVITY_CATEGORY_LABELS[activity.activityCategory] ?? activity.activityCategory}
                      </td>
                      <td className="px-4 py-3 text-left hidden lg:table-cell">
                        {eventMap[activity.eventId] ?? activity.eventId}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {activity.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {canEdit && (
                            <ButtonElement
                              type="button"
                              text=""
                              icon={<Edit size={14} />}
                              onClick={() => handleEditClick(activity)}
                              className="!text-xs !font-bold !bg-teal-500 hover:!bg-teal-600"
                            />
                          )}
                          {canDelete && (
                            <DeleteButton
                              onConfirm={() => handleDelete(activity.id ?? '')}
                              headerText={<Trash size={14} />}
                              content="Are you sure you want to delete this activity?"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-gray-500 italic">
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

      {/* Add Modal */}
      <AddActivityModal
        visible={addModal}
        onClose={() => setAddModal(false)}
        onSuccess={() => {
          setAddModal(false)
          refetch()
        }}
      />

      {/* Edit Modal */}
      <EditActivityModal
        visible={editModal}
        activity={selectedActivity}
        onClose={() => {
          setEditModal(false)
          setSelectedActivity(null)
        }}
        onSuccess={() => {
          setEditModal(false)
          setSelectedActivity(null)
          refetch()
        }}
      />
    </>
  )
}

export default AllActivityForm