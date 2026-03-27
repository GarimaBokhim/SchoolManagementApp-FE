'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import {
  Filter, Plus, RotateCcw,
  Users, MoreVertical, Edit, Trash, Eye, User,
} from 'lucide-react'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import Pagination from '@/components/Pagination'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useLeads } from '@/app/crm/applications/leads/hooks/useLeads'
import { useLeadFilters } from '@/app/crm/applications/leads/hooks/useLeadFilters'
import { useLeadMutations } from '@/app/crm/applications/leads/hooks/useLeadsMutations'
import { LeadDetailModal } from '@/app/crm/applications/leads/components/LeadDetailModel'
import ConvertToApplicantModal from '@/app/crm/applications/leads/pages/Convert'
import AddLeadModal from '@/app/crm/applications/leads/pages/Add'
import { getEducationLevelText } from '@/app/crm/applications/leads/utils/helpers'
import {
  Lead,
  ConvertToApplicantPayload,
  SearchParam,
} from '@/app/crm/applications/leads/types/ILeads'

// ─── Action Menu ─────────────────────────────────────────────────────────────
interface ActionMenuProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const ActionMenu = ({
  lead,
  onView,
  onEdit,
  onConvert,
  onDelete,
  canEdit = true,
  canDelete = true,
}: ActionMenuProps) => {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const menuHeight = 160
    const menuWidth = 180
    const spaceBelow = window.innerHeight - rect.bottom
    const openUpward = spaceBelow < menuHeight + 8
    setMenuStyle({
      position: 'fixed',
      right: window.innerWidth - rect.right,
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      width: menuWidth,
      zIndex: 9999,
    })
  }, [])

  const toggle = () => {
    if (!open) calculatePosition()
    setOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  useEffect(() => {
    if (!open) return
    const update = () => calculatePosition()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, calculatePosition])

  return (
    <div className="flex justify-center">
      <button
        ref={buttonRef}
        onClick={toggle}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        title="Actions"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1"
        >
          <button
            onClick={() => { onView(lead); setOpen(false) }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Eye size={14} /> View Details
          </button>

          {canEdit && (
            <button
              onClick={() => { onEdit(lead); setOpen(false) }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Edit size={14} /> Edit
            </button>
          )}

          <button
            onClick={() => { onConvert(lead); setOpen(false) }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <User size={14} /> Convert to Applicant
          </button>

          {canDelete && (
            <button
              onClick={() => { onDelete(lead.id); setOpen(false) }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Trash size={14} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Enrolment Type Badge ────────────────────────────────────────────────────
const getEnrolmentTypeBadge = (type: number) => {
  switch (type) {
    case 1: return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Lead</span>
    case 2: return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Applicant</span>
    case 3: return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Student</span>
    default: return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">Unknown</span>
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────
const AllLeadsForm = () => {

  // ─── Permissions ─────────────────────────────────────────────────────────────
  const { menuStatus } = usePermissions()
  const { canEdit, canDelete } = useMenuPermissionData(menuStatus)

  // ─── Refs ─────────────────────────────────────────────────────────────────────
  const dateFilterRef = useRef<DateRangeFilterRef>(null)

  // ─── Pagination ───────────────────────────────────────────────────────────────
  const paginationForm = useForm<SearchParam>({
    defaultValues: { pageSize: 10, pageIndex: 1, isPagination: true },
  })

  // ─── Data ─────────────────────────────────────────────────────────────────────
  const {
    leads,
    loading,
    error,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    setParams,
    fetchLeads,
  } = useLeads()

  // ─── Filters ──────────────────────────────────────────────────────────────────
  const {
    openFilter,
    setOpenFilter,
    filterForm,
    selectedProfile,
    searchResults,
    handleFilterSubmit,
    fetchUsers,
    handleProfileSelected,
    onClearClick,
  } = useLeadFilters(setParams, setPaginationParams)

  // ─── Mutations ────────────────────────────────────────────────────────────────
  const { convertingId, handleDelete, handleConvert } = useLeadMutations(fetchLeads)

  // ─── Modal State ──────────────────────────────────────────────────────────────
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // ── Updated payload shape ──
  const [conversionData, setConversionData] = useState<ConvertToApplicantPayload>({
    userId: '',
    passportNo: '',
    countryId: '',
    universityId: '',
    courseId: '',
  })

  // ─── Handlers ─────────────────────────────────────────────────────────────────
  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead)
    setConversionData({
      userId: lead.userId,
      passportNo: '',
      countryId: '',
      universityId: '',
      courseId: '',
    })
    setShowConvertModal(true)
  }

  const handleViewDetails = (lead: Lead) => {
    setSelectedUserId(lead.userId)
    setShowDetailModal(true)
  }

  const handleEditLead = (lead: Lead) => {
    console.log('Edit lead:', lead)
  }

  const handleConversionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setConversionData((prev) => ({ ...prev, [name]: value }))
  }

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead) return
    const success = await handleConvert(selectedLead, conversionData)
    if (success) setShowConvertModal(false)
  }

  const handleSearch = (searchParams: SearchParam) => {
    searchParams.pageSize = paginationParams.pageSize
    setPaginationParams(searchParams)
  }

  const handleLeadSuccess = () => {
    fetchLeads()
    setIsAddLeadModalOpen(false)
  }

  // ─── Error State ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <Toaster position="top-right" />
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
          <div className="text-center py-16">
            <Users size={64} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Error loading leads
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="top-right" />

      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* ── Header ── */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Leads</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold"
              />
              <ButtonElement
                icon={<Plus size={20} />}
                type="button"
                text="Add"
                onClick={() => setIsAddLeadModalOpen(true)}
                className="!text-md !font-bold !bg-blue-600 hover:!bg-blue-700 !text-white"
              />
            </div>
          </div>

          {/* ── Filter Panel ── */}
          {openFilter && (
            <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form
                onSubmit={filterForm.handleSubmit(handleFilterSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                <DateRangeFilter
                  ref={dateFilterRef}
                  form={filterForm}
                  onSubmit={handleFilterSubmit}
                  setParams={setParams}
                />

                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedProfile?.fullName || ''}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Search Users"
                    name="firstName"
                    form={filterForm}
                    options={searchResults}
                    selected={selectedProfile}
                    onSelect={handleProfileSelected}
                    onFocus={() => fetchUsers('')}
                    getLabel={(profile) => profile?.fullName ?? ''}
                    getValue={(profile) => profile?.id ?? ''}
                  />
                </div>

                <div className="flex gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150 !text-white"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150 !text-white"
                  />
                </div>
              </form>
            </div>
          )}

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Education Level</th>
                  <th className="px-4 py-3 text-left">Completion Year</th>
                  <th className="px-4 py-3 text-left">Enrollment Type</th>
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex justify-center items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
                        Loading Leads...
                      </div>
                    </td>
                  </tr>
                ) : leads.length > 0 ? (
                  leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      id={`lead-${lead.id}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-1 px-4">
                        {((currentPage - 1) * paginationParams.pageSize + index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-1 px-4 font-medium">{lead.name}</td>
                      <td className="py-1 px-4">{lead.email}</td>
                      <td className="py-1 px-4">{lead.phone}</td>
                      <td className="py-1 px-4 capitalize">{lead.source}</td>
                      <td className="py-1 px-4">{getEducationLevelText(lead.educationLevel)}</td>
                      <td className="py-1 px-4">{lead.completionYear}</td>
                      <td className="py-1 px-4">{getEnrolmentTypeBadge(lead.enrolmentType)}</td>
                      <td className="py-1 px-4">
                        <ActionMenu
                          lead={lead}
                          onView={handleViewDetails}
                          onEdit={handleEditLead}
                          onConvert={handleConvertClick}
                          onDelete={handleDelete}
                          canEdit={canEdit}
                          canDelete={canDelete}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                      No Leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Pagination ── */}
        {!loading && leads.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={paginationForm}
              pagination={{
                currentPage,
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

      {/* ── Modals ── */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSuccess={handleLeadSuccess}
      />

      {showConvertModal && selectedLead && (
        <ConvertToApplicantModal
          isOpen={showConvertModal}
          onClose={() => setShowConvertModal(false)}
          selectedLead={selectedLead}
          conversionData={conversionData}
          convertingId={convertingId}
          onInputChange={handleConversionInputChange}
          onSubmit={handleConvertSubmit}
        />
      )}

      <LeadDetailModal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedUserId(null) }}
        userId={selectedUserId}
      />
    </>
  )
}

export default AllLeadsForm