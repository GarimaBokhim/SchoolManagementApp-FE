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

/** Backend may return PascalCase JSON; normalize to camelCase DTOs. */
function normalizeFeeStructureDto(raw: Record<string, unknown>): IFeeStructureDTO {
  return {
    feeTypeId: String(raw.feeTypeId ?? raw.FeeTypeId ?? ''),
    amount: Number(raw.amount ?? raw.Amount ?? 0),
    discountAmount: Number(raw.discountAmount ?? raw.DiscountAmount ?? 0),
    times: Number(raw.times ?? raw.Times ?? 1),
    totalAmount: Number(raw.totalAmount ?? raw.TotalAmount ?? 0),
    feePaidType: Number(raw.feePaidType ?? raw.FeePaidType ?? 1),
  }
}

export function normalizeFeeStructureDetailPayload(
  data: unknown
): IFeeStructureDetail {
  const d = data as Record<string, unknown>
  const dtosRaw =
    d.feeStructureDTOs ??
    d.FeeStructureDTOs ??
    d.feeStructureDtos ??
    []

  const arr = Array.isArray(dtosRaw) ? dtosRaw : []

  return {
    ...(data as IFeeStructureDetail),
    id: String(d.id ?? d.Id ?? ''),
    classId: String(d.classId ?? d.ClassId ?? ''),
    feeCategoryName: String(d.feeCategoryName ?? d.FeeCategoryName ?? ''),
    fyId: String(d.fyId ?? d.FyId ?? ''),
    feeStructureDTOs: arr.map((item) =>
      normalizeFeeStructureDto(item as Record<string, unknown>)
    ),
  }
}

export const useGetFeeStructureById = (feeStructureId: string) => {
  return useQuery({
    queryKey: [queryKey, feeStructureId],
    queryFn: async (): Promise<IFeeStructureDetail> => {
      const response = await api.get<unknown>(
        `/api/Finance/FeeStructure/${feeStructureId}`
      )
      return normalizeFeeStructureDetailPayload(response.data)
    },
    enabled: !!feeStructureId?.trim(),
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