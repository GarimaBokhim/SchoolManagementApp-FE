// src/app/crm/applications/students/hooks/index.ts

import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent'
import {
  ApiResponse,
  Student,
  FilterFormData,
  UserProfile,
  UserProfileResponse,
} from '../type/IStudents'

// ── Endpoint Constants ────────────────────────────────────────────

const StudentEndPoints = {
  filterStudents: '/api/Enrolments/FilterCRMStudents',
  allUserProfiles: '/api/Enrolments/GetAllUserProfile',
  deleteStudent: '/api/Enrolments',
}

// ── Local Types ───────────────────────────────────────────────────

interface School {
  id: string
  name: string
}

interface AllSchoolsData {
  Items: School[]
}

// ── useStudents ───────────────────────────────────────────────────

export const useStudents = (allSchools: AllSchoolsData | undefined) => {
  const [students, setStudents] = useState<Student[]>([])

  // `loading` = true only on the very first fetch (no data yet)
  const [loading, setLoading] = useState(true)

  // `isFetching` = true on every subsequent fetch (old data stays visible underneath)
  const [isFetching, setIsFetching] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState('')
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  })
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const hasLoadedOnce = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const { handleError } = useErrorHandler()

  const getSchoolName = useCallback(
    (schoolId: string) => {
      return allSchools?.Items?.find((s) => s.id === schoolId)?.name || 'Unknown School'
    },
    [allSchools]
  )

  const buildQueryString = useCallback(() => {
    return (
      `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}` +
      (params || '')
    )
  }, [paginationParams, params])

  const fetchStudents = useCallback(async () => {
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
      const queryString = buildQueryString()
      const response = await api.get<ApiResponse>(
        `${StudentEndPoints.filterStudents}${queryString}`,
        { signal: abortControllerRef.current.signal }
      )
      const data = response.data
      const items = data.Items || []

      const formatted: Student[] = items.map((item) => ({
        id: item.id,
        userId: item.userId,
        fullName: item.fullName || '-',
        email: item.email || '-',
        enrolmentType: item.enrolmentType,
        universityName: item.universityName || '-',
        visaId: item.visaId || '-',
        isActive: item.isActive,
        schoolId: item.schoolId,
        schoolName: getSchoolName(item.schoolId),
        createdBy: item.createdBy,
        createdAt: item.createdAt,
        modifiedBy: item.modifiedBy,
        modifiedAt: item.modifiedAt,
      }))

      setStudents(formatted)
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
      Toast.error('Failed to fetch students')
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }, [buildQueryString, getSchoolName, handleError, paginationParams.pageIndex])

  useEffect(() => {
    if (allSchools) {
      fetchStudents()
    }
    // fetchStudents intentionally omitted — raw deps below are the real triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.pageIndex, paginationParams.pageSize, params, allSchools])

  return {
    students,
    loading,      // true only on initial load
    isFetching,   // true on filter/page changes — use for subtle overlay
    error,
    params,
    setParams,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    fetchStudents,
  }
}

// ── useStudentFilters ─────────────────────────────────────────────

export const useStudentFilters = (
  setParams: (params: string) => void,
  setPaginationParams: React.Dispatch<
    React.SetStateAction<{ pageSize: number; pageIndex: number; isPagination: boolean }>
  >
) => {
  const [openFilter, setOpenFilter] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined)
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const dateFilterRef = useRef<DateRangeFilterRef | null>(null)

  const { clearError } = useErrorHandler()

  const filterForm = useForm<FilterFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      firstName: '',
    },
  })

  // Plain synchronous function — React 18 batches these two setState calls
  // automatically inside event handlers so only one re-fetch fires.
  // The AbortController in useStudents cancels stale requests for any edge cases.
  const handleFilterSubmit = (formData: FilterFormData) => {
    clearError()
    const queryParams = [
      formData.firstName?.trim()
        ? `firstName=${encodeURIComponent(formData.firstName.trim())}`
        : null,
      formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
      formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
    ]
      .filter(Boolean)
      .join('&')

    const fullQuery = queryParams ? `&${queryParams}` : ''
    setParams(fullQuery)
    setPaginationParams((prev) => ({ ...prev, pageIndex: 1 }))
  }

  const fetchUsers = async (search: string = '') => {
    setIsSearching(true)
    try {
      const response = await api.get<UserProfileResponse>(
        `${StudentEndPoints.allUserProfiles}?search=${encodeURIComponent(search)}`
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
    dateFilterRef.current?.handleClear()
    setSelectedProfile(undefined)
    filterForm.reset()
    setPaginationParams((prev) => ({ ...prev, pageIndex: 1 }))
    Toast.success('Filters cleared')
  }

  return {
    openFilter,
    setOpenFilter,
    filterForm,
    dateFilterRef,
    selectedProfile,
    searchResults,
    isSearching,
    handleFilterSubmit,
    fetchUsers,
    handleProfileSelected,
    onClearClick,
  }
}

// ── useProfileSearch ──────────────────────────────────────────────

export const useProfileSearch = () => {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined)
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const fetchUsers = useCallback(async (search: string = '') => {
    setIsSearching(true)
    try {
      const response = await api.get<UserProfileResponse>(
        `${StudentEndPoints.allUserProfiles}?search=${encodeURIComponent(search)}`
      )
      if (response.data?.Items) {
        setSearchResults(response.data.Items)
      }
    } catch {
      Toast.error('Failed to search profiles')
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleProfileSelected = useCallback((
    profile: UserProfile | null,
    callback?: (profile: UserProfile) => void
  ) => {
    if (!profile) return
    setSelectedProfile(profile)
    if (callback) {
      callback(profile)
    }
  }, [])

  return {
    selectedProfile,
    searchResults,
    isSearching,
    fetchUsers,
    handleProfileSelected,
    setSelectedProfile,
  }
}

// ── useStudentMutations ───────────────────────────────────────────

export const useStudentMutations = (fetchStudents: () => void) => {
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${StudentEndPoints.deleteStudent}/${id}`)
      Toast.success('Student deleted successfully!')
      fetchStudents()
    } catch {
      Toast.error('Error deleting student.')
    }
  }

  const handleEdit = () => {
    Toast.info(`Editing student`)
  }

  return {
    handleDelete,
    handleEdit,
  }
}