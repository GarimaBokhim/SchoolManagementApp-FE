import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'
import {
  IAcademicTeam,
  IAssignClass,
  IAssignClassTeacherRequest,
  IAssignClassTeacherResponse,
  IAssignedClassDetails,
  IClassTeacherDetails,
  IClassWithSubjectDetailsResponse,
} from '../types/IAcademicTeam'
const AcademicTeamEndPoints = {
  getAllAcademicTeams: '/api/StaffControllers/all-AcademicTeam',
  createAcademicTeams: '/api/StaffControllers/AddAcademicTeam',
  removeAcademicTeams: '/api/StaffControllers/DeleteAcademicTeams',
  updateAcademicTeams: '/api/StaffControllers/UpdateAcademicTeams',
  getAcademicTeamsById: '/api/StaffControllers/GetAcademicTeamsBy',
  filterAcademicTeamByDate: '/api/StaffControllers/FilterAcademicTeam',
  assignClass: '/api/StaffControllers/AssignClass',
  unAssignClass: '/api/StaffControllers/UnAssignClass',
  unAssignAllClass: '/api/StaffControllers/UnAssignAllClass',
  allschoolclass: '/api/Academics/all-SchoolClass',
  assignClassDetails: '/api/StaffControllers/AssignClassDetails',
  classWithSubjectByAcademicTeam:
    '/api/StaffControllers/ClassWithSubjectByAcademicTeam',
  assignClassTeacher: '/api/StaffControllers/AssignClassTeacher',
  classTeacher: '/api/StaffControllers/ClassTeacher',
}

const queryKey = 'AcademicTeams'
const filterAcademicTeamQueryKey = 'filteredAcademicTeam'
const AssignQueryKey = 'assignedClass'
const ClassTeacherQueryKey = 'classTeacher'
type AcademicTeamRequest = {
  id?: string
  email: string
  username: string
  password: string
  fullName: string
  teacherImg: File
  address: string
  provinceId: number
  districtId: number
  vdcid: number
  municipalityId: number
  wardNumber: number
  gender: number
  rolesId: string[]
}

export const useAddAcademicTeam = () => {
  const queryClient = useQueryClient()

  return useMutation<IAcademicTeam, Error, FormData>({
    mutationFn: async (formData: FormData): Promise<IAcademicTeam> => {
      console.log('Add Academic Team (multipart)', formData)
      const response = await api.post(
        AcademicTeamEndPoints.createAcademicTeams,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({ queryKey: [filterAcademicTeamQueryKey] })
    },

    onError: (error) => {
      console.error('Error adding student:', error)
    },
  })
}
export const useRemoveAcademicTeam = () => {
  const queryClient = useQueryClient()
  return useMutation<IAcademicTeam, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IAcademicTeam> => {
      if (!Id) {
        throw new Error('Id is required to remove a AcademicTeam')
      }
      const response = await api.delete(
        `${AcademicTeamEndPoints.removeAcademicTeams}/${Id}`
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({ queryKey: [filterAcademicTeamQueryKey] })
    },
  })
}

export const useEditAcademicTeam = () => {
  const queryClient = useQueryClient()
  return useMutation<
    IAcademicTeam,
    Error,
    { id: string | unknown; data: AcademicTeamRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IAcademicTeam> => {
      if (!id) {
        throw new Error('Ïd is required to edit AcademicTeam')
      }
      const response = await api.patch(
        `${AcademicTeamEndPoints.updateAcademicTeams}/${id}`,
        data
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filterAcademicTeamQueryKey] })
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })
}

export const useGetAcademicTeamById = (AcademicTeamId: string) => {
  return useQuery({
    queryKey: [queryKey, AcademicTeamId],
    queryFn: async (): Promise<IAcademicTeam> => {
      if (!AcademicTeamId) {
        throw new Error('Id is required to get a AcademicTeam')
      }
      const response = await api.get<IAcademicTeam>(
        `${AcademicTeamEndPoints.getAcademicTeamsById}/${AcademicTeamId}`
      )
      return response.data
    },
    enabled: !!AcademicTeamId,
    staleTime: 0,
    retry: false,
  })
}

export const useGetAllAcademicTeams = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${AcademicTeamEndPoints.getAllAcademicTeams}${params}`
        : `${AcademicTeamEndPoints.getAllAcademicTeams}`
      const response = await api.get<IPaginationResponse<IAcademicTeam>>(url)
      return (
        response.data ?? {
          data: [],
          PageIndex: 0,
          isPagination: 1,
          pageSize: 10,
        }
      )
    },
  })
}

export const useFilterAcademicTeamByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterAcademicTeamQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${AcademicTeamEndPoints.filterAcademicTeamByDate}${params}`
        : AcademicTeamEndPoints.filterAcademicTeamByDate
      const response = await api.get<IPaginationResponse<IAcademicTeam>>(url)
      return response.data
    },
    staleTime: 0,
    retry: false,
  })
}

export const useAssignClass = () => {
  const queryClient = useQueryClient()
  return useMutation<IAssignClass, Error, IAssignClass>({
    mutationFn: async (data: IAssignClass): Promise<IAssignClass> => {
      const response = await api.post(AcademicTeamEndPoints.assignClass, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AssignQueryKey] })
    },
    onError: (error: Error) => {
      console.log('Error assigning Sub module', error)
    },
  })
}

export const useUnassignClass = () => {
  const queryClient = useQueryClient()

  return useMutation<IAssignClass, Error, IAssignClass>({
    mutationFn: async (data: IAssignClass): Promise<IAssignClass> => {
      const response = await api.post(AcademicTeamEndPoints.unAssignClass, data)
      return response.data
    },
    onSuccess: () => {
      // Refresh assigned class queries after unassigning
      queryClient.invalidateQueries({ queryKey: [AssignQueryKey] })
    },
    onError: (error: Error) => {
      console.error('Error unassigning class/subject', error)
    },
  })
}

export const useGetAssignClassDetails = (params?: string) => {
  return useQuery({
    queryKey: [AssignQueryKey, params],
    queryFn: async () => {
      const url = params
        ? `${AcademicTeamEndPoints.assignClassDetails}${params}`
        : `${AcademicTeamEndPoints.assignClassDetails}`

      const response =
        await api.get<IPaginationResponse<IAssignedClassDetails>>(url)

      return (
        response.data ?? {
          items: [],
          totalItems: 0,
          pageIndex: 1,
          pageSize: 10,
          totalPages: 0,
        }
      )
    },
  })
}

export const useGetClassWithSubjectByAcademicTeam = (
  academicTeamId: string
) => {
  return useQuery({
    queryKey: [AssignQueryKey, 'classWithSubjects', academicTeamId],
    queryFn: async () => {
      if (!academicTeamId) {
        throw new Error('Academic team ID is required')
      }

      const response = await api.get<
        IClassWithSubjectDetailsResponse[] | IClassWithSubjectDetailsResponse
      >(
        `${AcademicTeamEndPoints.classWithSubjectByAcademicTeam}/${encodeURIComponent(academicTeamId)}`
      )
      return Array.isArray(response.data) ? response.data : [response.data]
    },
    enabled: Boolean(academicTeamId),
    staleTime: 0,
    retry: false,
  })
}

export const useGetClassTeacher = (academicTeamId: string) => {
  return useQuery({
    queryKey: [ClassTeacherQueryKey, academicTeamId],
    queryFn: async (): Promise<IClassTeacherDetails> => {
      if (!academicTeamId) {
        throw new Error('Academic team ID is required')
      }

      const response = await api.get<IClassTeacherDetails>(
        `${AcademicTeamEndPoints.classTeacher}/${encodeURIComponent(academicTeamId)}`
      )
      return response.data
    },
    enabled: Boolean(academicTeamId),
    retry: false,
  })
}

export const useAssignClassTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation<
    IAssignClassTeacherResponse,
    Error,
    IAssignClassTeacherRequest
  >({
    mutationFn: async (
      data: IAssignClassTeacherRequest
    ): Promise<IAssignClassTeacherResponse> => {
      const response = await api.post<IAssignClassTeacherResponse>(
        AcademicTeamEndPoints.assignClassTeacher,
        data
      )
      return response.data
    },
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ClassTeacherQueryKey, variables.AcademicTeamId],
      })
    },
  })
}
