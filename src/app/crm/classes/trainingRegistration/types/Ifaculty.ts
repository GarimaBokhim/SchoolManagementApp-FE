export interface Faculty {
  id: string
  facultyId: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  department?: string
  specialization?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface FacultySearchParam {
  pageSize: number
  pageIndex: number
  isPagination: boolean
  firstName?: string
  department?: string
  status?: string
  fromDate?: string
  toDate?: string
}

export interface FacultyFilterParams {
  firstName?: string
  department?: string
  status?: string
  fromDate?: string
  toDate?: string
  pageSize?: number
  pageIndex?: number
  isPagination?: boolean
}
