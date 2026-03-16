'use client'

import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { useGetAllTrainingRegistrations } from '../../hooks'
import { TrainingRegistration, AddTrainingRegistrationPayload } from '../../class/types/IClass'
import { useRegistrationMutations } from '../../hooks/useRegistrationMutaiton'
import { AddTrainingRegistrationModal } from './AddTrainingRegistrationModel'

const AllRegistrationsForms = () => {
  const [queryParams, setQueryParams] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const { data, isLoading, refetch } = useGetAllTrainingRegistrations(queryParams)
  const { handleAdd, handleDelete, handleEdit } = useRegistrationMutations(refetch)

  const registrations: TrainingRegistration[] = data?.Items ?? []

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    setQueryParams(params.toString())
  }

  const handleClear = () => {
    setStartDate('')
    setEndDate('')
    setQueryParams('')
  }

  const handleAddSubmit = async (payload: AddTrainingRegistrationPayload) => {
    await handleAdd(payload)
    setIsAddModalOpen(false)
  }

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Training Registrations</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Filter size={15} /> Filter
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                <Plus size={15} /> Add Registration
              </button>
            </div>
          </div>

          {/* Filter */}
          {showFilter && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2b2e]">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Search
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-sm">
              No registrations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-[#2a2b2e] text-gray-500 dark:text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">S.N.</th>
                    <th className="px-6 py-3">Applicant ID</th>
                    <th className="px-6 py-3">Class ID</th>
                    <th className="px-6 py-3">Registered At</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, index) => (
                    <tr
                      key={reg.id}
                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">{reg.applicantId}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">{reg.consultancyClassId}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {new Date(reg.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reg.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {reg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit()}
                            className="text-xs text-yellow-600 hover:text-yellow-700 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(reg.id)}
                            className="text-xs text-red-500 hover:text-red-600 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddTrainingRegistrationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
    </>
  )
}

export default AllRegistrationsForms