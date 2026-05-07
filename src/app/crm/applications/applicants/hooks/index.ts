// src/app/crm/applications/applicants/hooks/index.ts

import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/instance'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import {
  ApiResponse,
  Applicant,
  School,
  FilterFormData,
  UserProfile,
  UserProfileResponse,
  SearchParam,
  ConvertToStudentPayload,
} from '../types/IApplicants'

// ── Endpoint Constants ────────────────────────────────────────────

const ApplicantEndPoints = {
  filterApplicants: '/api/Enrolments/FilterApplicants',
  userProfile: '/api/Enrolments/UserProfile',
  allUserProfiles: '/api/Enrolments/GetAllUserProfile',
  convertToStudents: '/api/Enrolments/ConvertToStudents',
}

// ── Helpers ───────────────────────────────────────────────────────

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const response = await api.get<UserProfile>(`${ApplicantEndPoints.userProfile}/${userId}`)
    return response.data
  } catch {
    return null
  }
}

// ── useApplicants ─────────────────────────────────────────────────

export const useApplicants = (allSchools?: { Items: School[] }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([])

  // `loading` = true only on the very first fetch (no data yet)
  const [loading, setLoading] = useState(true)

  // `isFetching` = true on every subsequent fetch (old data stays visible underneath)
  const [isFetching, setIsFetching] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  })
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [params, setParams] = useState('')

  const hasLoadedOnce = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { handleError } = useErrorHandler()

  const getSchoolName = useCallback(
    (schoolId: string) => {
      return (
        allSchools?.Items?.find((school: School) => school.id === schoolId)?.name ||
        'Unknown School'
      )
    },
    [allSchools]
  )

  const buildQueryString = useCallback(() => {
    const baseQuery = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
    return baseQuery + (params || '')
  }, [paginationParams, params])

  const fetchApplicants = useCallback(
    async (customParams?: string) => {
      // Cancel any previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      // First load → full loading state; subsequent → subtle isFetching only
      if (!hasLoadedOnce.current) {
        setLoading(true)
      } else {
        setIsFetching(true)
      }

      setError(null)

      try {
        const queryString = customParams || buildQueryString()
        const url = `${ApplicantEndPoints.filterApplicants}${queryString}`

        const response = await api.get<ApiResponse>(url, {
          signal: abortControllerRef.current.signal,
        })
        const data = response.data
        const items = data.Items || []

        const profiles = await Promise.all(
          items.map((item) => fetchUserProfile(item.userId))
        )

        const formattedApplicants: Applicant[] = items.map((item, index) => {
          const profile = profiles[index]
          return {
            id: item.id,
            userId: item.userId,
            passportNo: item.passportNo || '-',
            targetCountry: item.targetCountry || '-',
            isActive: item.isActive,
            schoolId: item.schoolId,
            schoolName: getSchoolName(item.schoolId),
            createdBy: item.createdBy,
            createdAt: item.createdAt,
            modifiedBy: item.modifiedBy,
            modifiedAt: item.modifiedAt,
            fullName: profile?.fullName ?? '-',
            email: profile?.email ?? '-',
            enrolmentType: profile?.enrolmentType,
          }
        })

        setApplicants(formattedApplicants)
        setTotalItems(data.TotalItems ?? 0)
        setTotalPages(data.TotalPages ?? 1)
        setCurrentPage(data.PageIndex ?? paginationParams.pageIndex)

        hasLoadedOnce.current = true
      } catch (err: unknown) {
        // Ignore intentional cancellations
        if (
          (err as { name?: string })?.name === 'AbortError' ||
          (err as { code?: string })?.code === 'ERR_CANCELED'
        ) {
          return
        }
        const errorMsg = handleError(err)
        setError(errorMsg)
        Toast.error('Failed to fetch applicants')
      } finally {
        setLoading(false)
        setIsFetching(false)
      }
    },
    [buildQueryString, getSchoolName, handleError, paginationParams.pageIndex]
  )

  useEffect(() => {
    if (allSchools) {
      fetchApplicants()
    }
    // fetchApplicants intentionally omitted — raw deps below are the real triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.pageIndex, paginationParams.pageSize, params, allSchools])

  return {
    applicants,
    loading,          // true only on initial load — use for full skeleton/spinner
    isFetching,       // true on filter/page changes — use for subtle overlay
    error,
    paginationParams,
    setPaginationParams,
    totalItems,
    totalPages,
    currentPage,
    params,
    setParams,
    fetchApplicants,
    getSchoolName,
  }
}

// ── useApplicantFilters ───────────────────────────────────────────

export const useApplicantFilters = (
  setParams: (params: string) => void,
  setPaginationParams: (updater: (prev: SearchParam) => SearchParam) => void
) => {
  const [openFilter, setOpenFilter] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined)
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const filterForm = useForm<FilterFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      firstName: '',
    },
  })

  const handleFilterSubmit = (formData: FilterFormData) => {
    const queryParams = [
      formData.firstName ? `firstName=${encodeURIComponent(formData.firstName)}` : null,
      formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
      formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
    ]
      .filter(Boolean)
      .join('&')

    const fullQuery = queryParams ? `&${queryParams}` : ''
    setParams(fullQuery)
    setPaginationParams((prev: SearchParam) => ({ ...prev, pageIndex: 1 }))
  }

  const fetchUsers = async (search: string = '') => {
    setIsSearching(true)
    try {
      const response = await api.get<UserProfileResponse>(
        `${ApplicantEndPoints.allUserProfiles}?search=${encodeURIComponent(search)}`
      )
      if (response.data?.Items) {
        setSearchResults(response.data.Items)
      }
    } catch {
      Toast.error('Failed to search profiles')
    } finally {
      setIsSearching(false)
    }
  }

  const handleProfileSelected = (profile: UserProfile | null) => {
    if (!profile) return
    setSelectedProfile(profile)
    filterForm.setValue('firstName', profile.fullName)
    handleFilterSubmit(filterForm.getValues())
  }

  const onClearClick = () => {
    setParams('')
    setSelectedProfile(undefined)
    filterForm.reset()
    setPaginationParams((prev: SearchParam) => ({ ...prev, pageIndex: 1 }))
    Toast.success('Filters cleared')
  }

  return {
    openFilter,
    setOpenFilter,
    filterForm,
    selectedProfile,
    setSelectedProfile,
    searchResults,
    isSearching,
    handleFilterSubmit,
    fetchUsers,
    handleProfileSelected,
    onClearClick,
  }
}

// ── useApplicantMutations ─────────────────────────────────────────

export const useApplicantMutations = (refetchApplicants: () => void) => {
  const [convertingId, setConvertingId] = useState<string | null>(null)
  const { handleError } = useErrorHandler()

  const handleDelete = async (applicant: Applicant) => {
    try {
      // await api.delete(`/api/Enrolments/${applicant.id}`)
      Toast.success('Applicant deleted successfully!')
      refetchApplicants()
    } catch {
      Toast.error('Error deleting applicant.')
    }
  }

  const handleConvert = async (
    selectedApplicant: Applicant,
    conversionData: ConvertToStudentPayload
  ) => {
    try {
      setConvertingId(selectedApplicant.id)
      await api.post(ApplicantEndPoints.convertToStudents, conversionData)
      Toast.success(`Successfully converted to student!`)
      refetchApplicants()
      return true
    } catch (error: unknown) {
      const errorMsg = handleError(error)
      Toast.error(`Error: ${errorMsg}`)
      return false
    } finally {
      setConvertingId(null)
    }
  }

  const handleViewDetails = () => {
    Toast.info(`Viewing details for applicant`)
  }

  const handleEdit = () => {
    Toast.info(`Editing applicant`)
  }

  return {
    convertingId,
    handleDelete,
    handleConvert,
    handleViewDetails,
    handleEdit,
  }
}