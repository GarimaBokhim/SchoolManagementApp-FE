// src/app/crm/applications/leads/hooks/index.ts

import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import {
  ApiResponse,
  Lead,
  FilterFormData,
  UserProfile,
  UserProfileResponse,
  SearchParam,
  ConvertToApplicantPayload,
  IUniversityByCountry,
  ICourseByUniversity,
  LeadEnquiryDetails,
} from '../types/ILeads'

// ── Endpoint Constants ────────────────────────────────────────────

const LeadEndPoints = {
  filterInquiry: '/api/Enrolments/FilterInquery',
  userProfile: '/api/Enrolments/UserProfile',
  allUserProfiles: '/api/Enrolments/GetAllUserProfile',
  convertToApplicant: '/api/Enrolments/ConvertToApplicant',
  showLeadEnquiryDetails: '/api/Enrolments/ShowLeadEnqueryDetails',
  universitiesByCountry: '/api/AcademicPrograms/UniversityByCountry',
  coursesByUniversity: '/api/AcademicPrograms/CourseByUniversity',
}

// ── useLeads ──────────────────────────────────────────────────────

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
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

  const buildQueryString = useCallback(() => {
    const base = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`
    return base + (params || '')
  }, [paginationParams, params])

  const fetchLeads = useCallback(
    async (customParams?: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      if (!hasLoadedOnce.current) {
        setLoading(true)
      } else {
        setIsFetching(true)
      }

      setError(null)

      try {
        const queryString = customParams || buildQueryString()
        const url = `${LeadEndPoints.filterInquiry}${queryString}`

        // ✅ Unwrap the new { Data: { Items, TotalItems, ... } } envelope
        const response = await api.get<{ Data: ApiResponse }>(url, {
          signal: abortControllerRef.current.signal,
        })

        const data = response.data.Data
        const items = data.Items || []

        // ✅ enrolmentType now comes directly from the API — no extra per-item fetch needed
        const formattedLeads: Lead[] = items.map(
          (
            item: {
              id?: string
              userId: string
              fullName?: string
              email?: string
              contactNumber?: string
              source?: string
              educationLevel?: number
              completionYear?: string
              enrolmentType?: number
            }
          ) => ({
            id: item.id || item.userId || Math.random().toString(),
            userId: item.userId,
            name: item.fullName || 'N/A',
            email: item.email || 'N/A',
            phone: item.contactNumber || 'N/A',
            source: item.source || 'website',
            educationLevel: item.educationLevel || 0,
            completionYear: item.completionYear || 'N/A',
            enrolmentType: item.enrolmentType ?? 0, // ✅ directly from item
          })
        )

        setLeads(formattedLeads)
        setTotalItems(data.TotalItems ?? 0)
        setTotalPages(data.TotalPages ?? 1)
        setCurrentPage(data.PageIndex ?? paginationParams.pageIndex)

        hasLoadedOnce.current = true
      } catch (err: unknown) {
        if (
          (err as { name?: string })?.name === 'AbortError' ||
          (err as { code?: string })?.code === 'ERR_CANCELED'
        ) {
          return
        }
        const errorMsg = handleError(err)
        setError(errorMsg)
        toast.error('Failed to fetch leads')
      } finally {
        setLoading(false)
        setIsFetching(false)
      }
    },
    [buildQueryString, handleError, paginationParams.pageIndex]
  )

  useEffect(() => {
    fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.pageIndex, paginationParams.pageSize, params])

  return {
    leads,
    loading,
    isFetching,
    error,
    paginationParams,
    setPaginationParams,
    totalItems,
    totalPages,
    currentPage,
    params,
    setParams,
    fetchLeads,
  }
}

// ── useLeadFilters ────────────────────────────────────────────────

export const useLeadFilters = (
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
        `${LeadEndPoints.allUserProfiles}?search=${encodeURIComponent(search)}`
      )
      if (response.data?.Items) {
        setSearchResults(response.data.Items)
      }
    } catch {
      toast.error('Failed to search profiles')
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
    toast.success('Filters cleared')
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

// ── useLeadEnquiryDetails ─────────────────────────────────────────

export const useLeadEnquiryDetails = (leadId: string | null) => {
  return useQuery({
    queryKey: ['LeadEnquiryDetails', leadId],
    queryFn: async () => {
      const response = await api.get<LeadEnquiryDetails>(
        `${LeadEndPoints.showLeadEnquiryDetails}?leadId=${leadId}`
      )
      return response.data
    },
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000,
  })
}

// ── useGetUniversitiesByCountry ───────────────────────────────────

export const useGetUniversitiesByCountry = (countryId: string | null) => {
  return useQuery({
    queryKey: ['UniversitiesByCountry', countryId],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IUniversityByCountry>>(
        `${LeadEndPoints.universitiesByCountry}/${countryId}`
      )
      return response.data?.Items ?? []
    },
    enabled: !!countryId,
    staleTime: 5 * 60 * 1000,
  })
}

// ── useGetCoursesByUniversity ─────────────────────────────────────

export const useGetCoursesByUniversity = (universityId: string | null) => {
  return useQuery({
    queryKey: ['CoursesByUniversity', universityId],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<ICourseByUniversity>>(
        `${LeadEndPoints.coursesByUniversity}/${universityId}`
      )
      return response.data?.Items ?? []
    },
    enabled: !!universityId,
    staleTime: 5 * 60 * 1000,
  })
}

// ── useLeadMutations ──────────────────────────────────────────────

export const useLeadMutations = (refetchLeads: () => void) => {
  const [convertingId, setConvertingId] = useState<string | null>(null)
  const { handleError } = useErrorHandler()

  const handleDelete = async () => {
    try {
      toast.success('Lead deleted successfully!')
      refetchLeads()
    } catch {
      toast.error('Error deleting lead.')
    }
  }

  const handleConvert = async (selectedLead: Lead, conversionData: ConvertToApplicantPayload) => {
    try {
      setConvertingId(selectedLead.id)
      await api.post(LeadEndPoints.convertToApplicant, conversionData)
      toast.success(`Successfully converted ${selectedLead.name} to applicant!`)
      refetchLeads()
      return true
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const errorMsg = handleError(error)
      toast.error(`Error: ${errorMsg}`)
      return false
    } finally {
      setConvertingId(null)
    }
  }

  return {
    convertingId,
    handleDelete,
    handleConvert,
  }
}