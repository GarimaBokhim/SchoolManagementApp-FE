import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'
import { IStudent } from '../types/IStudents'
const StudentEndPoints = {
  getAllStudents: '/api/Student/StudentFromRegistration',
  createStudents: '/api/Student/AddStudents',
  removeStudents: '/api/Student/DeleteStudents',
  updateStudents: '/api/Student/UpdateStudents',
  getStudentsById: '/api/Student/StudentsBy',
  filterStudentByDate: '/api/Student/FilterStudents',
  getStudentsByClass: '/api/Student/GetStudentByClass',
  uploadstudents: '/api/Student/upload-students',
}

const queryKey = 'Students'
const filterQueryKey = 'filteredStudent'

const normalizeGenderStatus = (raw: unknown): number => {
  if (typeof raw === 'number') {
    if (raw >= 1 && raw <= 3) return raw
    if (raw >= 0 && raw <= 2) return raw + 1
  }
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase()
    if (normalized === 'male') return 1
    if (normalized === 'female') return 2
    if (normalized === 'other') return 3
    const asNumber = Number(normalized)
    if (!Number.isNaN(asNumber)) {
      if (asNumber >= 1 && asNumber <= 3) return asNumber
      if (asNumber >= 0 && asNumber <= 2) return asNumber + 1
    }
  }
  return 1
}

const normalizeStudent = (data: unknown): IStudent => {
  const raw = data as Record<string, unknown>
  return {
    ...(data as IStudent),
    id: String(raw.id ?? raw.Id ?? ''),
    feeCategoryId: String(raw.feeCategoryId ?? raw.FeeCategoryId ?? ''),
    firstName: String(raw.firstName ?? raw.FirstName ?? ''),
    middleName: String(raw.middleName ?? raw.MiddleName ?? ''),
    lastName: String(raw.lastName ?? raw.LastName ?? ''),
    registrationNumber: String(
      raw.registrationNumber ?? raw.RegistrationNumber ?? ''
    ),
    genderStatus: normalizeGenderStatus(
      raw.genderStatus ?? raw.GenderStatus ?? raw.gender ?? raw.Gender
    ),
    studentStatus: Number(
      raw.studentStatus ?? raw.StudentStatus ?? raw.status ?? raw.Status ?? 0
    ),
    dateOfBirth: (raw.dateOfBirth ?? raw.DateOfBirth ?? '') as string,
    email: String(raw.email ?? raw.Email ?? ''),
    phoneNumber: String(raw.phoneNumber ?? raw.PhoneNumber ?? ''),
    studentImg: (raw.studentImg ?? raw.StudentImg ?? '') as string,
    imageUrl: String(raw.imageUrl ?? raw.ImageUrl ?? ''),
    address: String(raw.address ?? raw.Address ?? ''),
    enrollmentDate: (raw.enrollmentDate ?? raw.EnrollmentDate ?? '') as string,
    parentId: String(raw.parentId ?? raw.ParentId ?? ''),
    classSectionId: String(raw.classSectionId ?? raw.ClassSectionId ?? ''),
    classId: String(raw.classId ?? raw.ClassId ?? ''),
    provinceId: Number(raw.provinceId ?? raw.ProvinceId ?? 0),
    districtId: Number(raw.districtId ?? raw.DistrictId ?? 0),
    municipalityId: Number(raw.municipalityId ?? raw.MunicipalityId ?? 0),
    vdcid: Number(raw.vdcid ?? raw.VdcId ?? raw.VDCId ?? 0),
    wardNumber: Number(raw.wardNumber ?? raw.WardNumber ?? 0),
    enrollmentStatus: Number(raw.enrollmentStatus ?? raw.EnrollmentStatus ?? 0),
  }
}

const normalizeStudentPaginationResponse = (
  data: IPaginationResponse<IStudent> | unknown
): IPaginationResponse<IStudent> => {
  const raw = data as Record<string, unknown>
  const itemsRaw = raw.Items ?? raw.items ?? []
  const items = Array.isArray(itemsRaw)
    ? itemsRaw.map((item) => normalizeStudent(item))
    : []

  return {
    ...(data as IPaginationResponse<IStudent>),
    Items: items,
  }
}

type StudentRequest = {
  id?: string
  firstName: string
  feeCategoryId?: string | null
  middleName?: string | null
  lastName: string
  registrationNumber: string
  genderStatus: number
  studentStatus: number
  dateOfBirth: string | Date
  email: string
  phoneNumber: string
  imageUrl?: string | null
  address: string
  enrollmentDate: string | Date
  parentId: string
  classSectionId?: string | null
  provinceId: number
  districtId: number
  wardNumber?: number | null
}

export const useAddStudent = () => {
  const queryClient = useQueryClient()

  return useMutation<IStudent, Error, FormData>({
    mutationFn: async (formData: FormData): Promise<IStudent> => {
      console.log('Add Student (multipart)', formData)
      const response = await api.post(
        StudentEndPoints.createStudents,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] })
    },

    onError: (error) => {
      console.error('Error adding student:', error)
    },
  })
}

export const useRemoveStudent = () => {
  const queryClient = useQueryClient()
  return useMutation<IStudent, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IStudent> => {
      if (!Id) {
        throw new Error('Id is required to remove a Student')
      }
      const response = await api.delete(
        `${StudentEndPoints.removeStudents}/${Id}`
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] })
    },
  })
}

export const useEditStudent = () => {
  const queryClient = useQueryClient()
  return useMutation<
    IStudent,
    Error,
    { id: string | unknown; data: StudentRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IStudent> => {
      if (!id) {
        throw new Error('Id is required to edit Student')
      }
      const response = await api.patch(
        `${StudentEndPoints.updateStudents}/${id}`,
        data
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] })
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })
}

export const useGetStudentById = (StudentId: string) => {
  return useQuery({
    queryKey: [queryKey, StudentId],
    queryFn: async (): Promise<IStudent> => {
      if (!StudentId) {
        throw new Error('Id is required to get a Student')
      }
      const response = await api.get<unknown>(
        `${StudentEndPoints.getStudentsById}/${StudentId}`
      )
      return normalizeStudent(response.data)
    },
    enabled: !!StudentId,
    retry: false,
  })
}

export const useGetAllStudents = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${StudentEndPoints.getAllStudents}${params}`
        : `${StudentEndPoints.getAllStudents}`
      const response = await api.get<IPaginationResponse<IStudent>>(url)
      return (
        normalizeStudentPaginationResponse(response.data) ?? {
          data: [],
          PageIndex: 0,
          isPagination: 1,
          pageSize: 10,
        }
      )
    },
  })
}

export const useFilterStudentByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${StudentEndPoints.filterStudentByDate}${params}`
        : StudentEndPoints.filterStudentByDate
      const response = await api.get<IPaginationResponse<IStudent>>(url)
      return normalizeStudentPaginationResponse(response.data)
    },
    retry: false,
  })
}

export const useGetStudentByClass = (ClassId: string) => {
  return useQuery({
    queryKey: [queryKey, ClassId],
    queryFn: async (): Promise<IPaginationResponse<IStudent>> => {
      if (!ClassId) {
        throw new Error('Id is required to get a Student')
      }
      const response = await api.get<IPaginationResponse<IStudent>>(
        `${StudentEndPoints.getStudentsByClass}/${ClassId}?classId=${ClassId}`
      )
      return normalizeStudentPaginationResponse(response.data)
    },
    enabled: !!ClassId,
    retry: false,
  })
}

export const useUploadStudents = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('formFile', file)

      const response = await api.post(
        StudentEndPoints.uploadstudents,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] })
    },

    retry: false,
  })
}

export const useGetAllStudentsV2 = () => {
  return useQuery({
    queryKey: ['Students-All'],

    queryFn: async (): Promise<IPaginationResponse<IStudent>> => {
      const response = await api.get('/api/Student/all-Students')

      return normalizeStudentPaginationResponse(response.data)
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,

    retry: false,
  })
}
