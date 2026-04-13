// src/app/crm/applications/followups/hooks/useFollowUps.ts

import { useState, useCallback, useRef, useEffect } from 'react'
import { api } from '@/utils/instance'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import toast from 'react-hot-toast'
import { FollowUp, FollowUpApiResponse, SearchParam } from '../types/IFollowUps'

export const useFollowUps = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paginationParams, setPaginationParams] = useState<SearchParam>({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  })
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

  const fetchFollowUps = useCallback(
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
        const url = `/api/Enrolments/FilterFollowUps${queryString}`

        const response = await api.get<FollowUpApiResponse>(url, {
          signal: abortControllerRef.current.signal,
        })

        const data = response.data
        setFollowUps(data.Items || [])
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
        toast.error('Failed to fetch follow ups')
      } finally {
        setLoading(false)
        setIsFetching(false)
      }
    },
    [buildQueryString, handleError, paginationParams.pageIndex]
  )

  useEffect(() => {
    fetchFollowUps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.pageIndex, paginationParams.pageSize, params])

  return {
    followUps,
    loading,
    isFetching,
    error,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    params,
    setParams,
    fetchFollowUps,
  }
}