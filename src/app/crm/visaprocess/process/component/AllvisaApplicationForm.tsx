/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useState, useMemo } from 'react'
import { FileText, Filter, RotateCcw, Plus } from 'lucide-react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { useForm } from 'react-hook-form'
import Pagination from '@/components/Pagination'
import { useGetAllVisaApplications } from '../hooks'
import { IVisaApplication } from '../types/Ivisaapplication'
import { usePermissions } from '@/context/auth/PermissionContext'
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData'
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import toast, { Toaster } from 'react-hot-toast'
import { UseFilterIntakes, useGetAllCountries, useGetAllCourses, useGetUniversities } from '@/app/crm/university/_university/hooks'
import { useGetAllLeads } from '@/app/crm/appointment/appointment/hooks'
import AddVisaApplicationForm from './AddvisaApplication'
import { VisaApplicationActionMenu } from './ActionMenue'
import { Toast } from '@/components/Toast/toast'

interface FilterFormData {
    startDate: string
    endDate: string
}

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.startsWith('0001')) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

const AllVisaApplicationsForm = () => {
    const { menuStatus } = usePermissions()
    const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus)

    const [openFilter, setOpenFilter] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedVisaApplication, setSelectedVisaApplication] = useState<IVisaApplication | null>(null)

    const [params, setParams] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const formRef = useRef<DateRangeFilterRef>(null)
    const pageSize = 10

    const form = useForm<FilterFormData>({
        defaultValues: { startDate: '', endDate: '' },
    })

    const paginationForm = useForm({
        defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
    })

    const { data, refetch } = useGetAllVisaApplications(params)

    const { data: leads = [] } = useGetAllLeads()
    const { data: countries = [] } = useGetAllCountries()
    const { data: universities = [] } = useGetUniversities()
    const { data: courses = [] } = useGetAllCourses()
    const { data: intakes = [] } = UseFilterIntakes()

    const visaForm = useForm<IVisaApplication>({
        defaultValues: {
            applicantId: '',
            countryId: '',
            universityId: '',
            courseId: '',
            intakeId: '',
            visaStatusId: '',
            appliedDate: '',
            visaDetails: '',
            emailSent: false,
            emailContent: '',
        },
    })

    const applicantMap = useMemo(() => {
        const map: Record<string, string> = {}
        leads.forEach((l: any) => { map[l.id] = l.fullName })
        return map
    }, [leads])

    const countryMap = useMemo(() => {
        const map: Record<string, string> = {}
        countries.forEach((c: any) => { map[c.id] = c.name })
        return map
    }, [countries])

    const universityMap = useMemo(() => {
        const map: Record<string, string> = {}
        universities.forEach((u: any) => { map[u.id] = u.name })
        return map
    }, [universities])

    const courseMap = useMemo(() => {
        const map: Record<string, string> = {}
        courses.forEach((c: any) => { map[c.id] = c.title })
        return map
    }, [courses])

    const intakeMap = useMemo(() => {
        const map: Record<string, string> = {}
        intakes.forEach((i: any) => { map[i.id] = i.name })
        return map
    }, [intakes])

    const applications: IVisaApplication[] = data?.Items ?? []
    const totalPages = data?.TotalPages ?? 1

    const onFilterSubmit = async (formData: FilterFormData) => {
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
                setCurrentPage(1)
                await refetch()
            })(),
            { loading: 'Fetching data...', success: 'Data fetched successfully!' }
        )
    }

    const handleClearFilters = () => {
        form.reset({ startDate: '', endDate: '' })
        setParams('')
        setCurrentPage(1)
        formRef.current?.handleClear()
        refetch()
    }

    const handleView = (visaApplication: IVisaApplication) => {
        setSelectedVisaApplication(visaApplication)
        setShowDetailModal(true)
    }

    const handleEdit = (visaApplication: IVisaApplication) => {
        Toast.info('Edit coming soon!')
    }

    const handleDelete = async (_id: string) => {
        Toast.info('Delete coming soon!')
    }

    const resolve = (map: Record<string, string>, id: string) =>
        map[id] ?? <span className="text-gray-400 italic text-xs">N/A</span>

    return (
        <>
            <Toaster position="top-right" />
            <div className="p-4 sm:p-6">
                <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
                        <h1 className="text-xl font-semibold dark:text-white">All Visa Applications</h1>
                        <div className="flex items-center space-x-3">
                            <ButtonElement
                                type="button"
                                text="Filter"
                                icon={<Filter size={14} />}
                                onClick={() => setOpenFilter(!openFilter)}
                                className="!bg-emerald-600 hover:!bg-emerald-700"
                            />
                            {/* {canAdd && ( */}
                            <ButtonElement
                                icon={<Plus size={18} />}
                                type="button"
                                text="Add New"
                                onClick={() => setIsAddModalOpen(true)}
                                className="!font-semibold"
                            />
                            {/* )} */}
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {openFilter && (
                        <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <form
                                onSubmit={form.handleSubmit(onFilterSubmit)}
                                className="flex flex-wrap items-end gap-4 md:gap-6"
                            >
                                <DateRangeFilter
                                    ref={formRef}
                                    form={form}
                                    onSubmit={onFilterSubmit}
                                    setParams={setParams}
                                    startDateKey="startDate"
                                    endDateKey="endDate"
                                />
                                <div className="flex gap-2 ml-auto">
                                    <ButtonElement
                                        type="submit"
                                        text="Apply"
                                        icon={<Filter size={14} />}
                                        className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                                    />
                                    <ButtonElement
                                        type="button"
                                        text="Clear"
                                        icon={<RotateCcw size={14} />}
                                        onClick={handleClearFilters}
                                        className="!bg-gray-500 hover:!bg-gray-600 !text-white"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Table */}
                    <div className="px-4 pb-4">
                        <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                                        <th className="px-4 py-3 text-left">S.N</th>
                                        <th className="px-4 py-3 text-left">Applicant</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">Country</th>
                                        <th className="px-4 py-3 text-left hidden md:table-cell">University</th>
                                        <th className="px-4 py-3 text-left hidden lg:table-cell">Course</th>
                                        <th className="px-4 py-3 text-left hidden lg:table-cell">Intake</th>
                                        <th className="px-4 py-3 text-left hidden lg:table-cell">Applied Date</th>
                                        <th className="px-4 py-3 text-center">Visa Status</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                                                No visa applications found.
                                            </td>
                                        </tr>
                                    ) : (
                                        applications.map((app, index) => (
                                            <tr
                                                key={app.id}
                                                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2b2e] transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-500">
                                                    {(currentPage - 1) * pageSize + index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                                    {resolve(applicantMap, app.applicantId)}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {resolve(countryMap, app.countryId)}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                                                    {resolve(universityMap, app.universityId)}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                                                    {resolve(courseMap, app.courseId)}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                                                    {resolve(intakeMap, app.intakeId)}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                                                    {formatDate(app.appliedDate)}
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                                                    {app.visaStatusId}
                                                </td>
                                                <td className="py-1 px-4">
                                                    <VisaApplicationActionMenu
                                                        visaApplication={app}  // ✅ Fixed: was `application`, now `app`
                                                        onView={handleView}
                                                        onEdit={handleEdit}
                                                        onDelete={handleDelete}
                                                        canEdit={canEdit}
                                                        canDelete={canDelete}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {applications.length > 0 && totalPages > 1 && (
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
                            handleSearch={(p) => setCurrentPage(p.pageIndex)}
                        />
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <AddVisaApplicationForm
                    form={visaForm}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}

            {/* View Detail Modal */}
            {/* {showDetailModal && selectedVisaApplication && (
                <VisaApplicationDetailModal
                    visaApplication={selectedVisaApplication}
                    applicantMap={applicantMap}
                    countryMap={countryMap}
                    universityMap={universityMap}
                    courseMap={courseMap}
                    onClose={() => {
                        setShowDetailModal(false)
                        setSelectedVisaApplication(null)
                    }}
                />
            )} */}
        </>
    )
}

export default AllVisaApplicationsForm