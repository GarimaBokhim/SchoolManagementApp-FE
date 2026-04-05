import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IStudentFeeDetails } from '../types/IStudentFee'

export interface IFeeStructureDetail {
  id: string
  classId: string
  feeCategoryName: string
  fyId: string
  feeStructureDTOs: IFeeStructureDTO[]
  isActive: boolean
  schoolId: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
}

export interface IFeeStructureDTO {
  feeTypeId: string
  amount: number
  discountAmount: number
  times: number
  totalAmount: number
  feePaidType: number
}

const queryKey = 'FeeStructureDetail'

export const useGetFeeStructureById = (feeStructureId: string) => {
  return useQuery({
    queryKey: [queryKey, feeStructureId],
    queryFn: async (): Promise<IFeeStructureDetail> => {
      const response = await api.get<IFeeStructureDetail>(
        `/api/Finance/FeeStructure/${feeStructureId}`
      )
      return response.data
    },
    enabled: !!feeStructureId,
    staleTime: 0,
    retry: false,
  })
}

// Maps API feeStructureDTOs → IStudentFeeDetails shape used by the form
export const mapFeeStructureDTOsToDetails = (
  dtos: IFeeStructureDTO[],
  discountPercentage: number = 0
): IStudentFeeDetails[] =>
  dtos.map((dto) => {
    const discountAmount = discountPercentage
      ? (dto.amount * discountPercentage) / 100
      : dto.discountAmount
    const totalAmount = dto.amount * dto.times - discountAmount * dto.times
    return {
      feeTypeId: dto.feeTypeId,
      amount: dto.amount,
      discountAmount,
      times: dto.times,
      totalAmount,
      feePaidType: dto.feePaidType,
    }
  })