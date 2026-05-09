import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IPaymentRecord, IStudentFee, IStudentFeeDetails, Istudentfeesummary } from "../types/IStudentFee";

const StudentFeeEndPoints = {
  getAllStudentFees: "/api/Finance/StudentFee",
  createStudentFees: "/api/Finance/AddStudentFee",
  removeStudentFees: "/api/Finance/DeleteStudentFees",
  updateStudentFees: "/api/Finance/UpdateStudentFee",
  filterStudentFeeByDate: "/api/Finance/FilterStudentFee",
  addpaymentrecords: "/api/Finance/AddPaymentsRecords",
  studentfeesummary: "/api/Finance/StudentFeeSummary",
  feeStructureByClass: "/api/Finance/FeeStructureByClass",
};

const queryKey = "StudentFees";
const filterQueryKey = "filteredStudentFee";
const paymentRecordKey = "PaymentRecords";

//  Updated to include studentFeeDetailsDTOs to match API schema
type StudentFeeRequest = {
  id?: string;
  studentId: string;
  feeStructureId: string;
  classId: string;
  discountPercentage: number;  
  studentFeeDetailsDTOs: IStudentFeeDetails[];
};

type IPaymentRequest = {
  studentid: string;
  classid: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: number;
  reference: string;
};

export interface IFeeStructureByClass {
  id: string;
  classId: string;
  fyId: string;
  feeCategoryName: string;
}

export const useAddStudentFee = () => {
  const queryClient = useQueryClient();
  return useMutation<IStudentFee, Error, StudentFeeRequest>({
    mutationFn: async (formData: StudentFeeRequest): Promise<IStudentFee> => {
      const response = await api.post(StudentFeeEndPoints.createStudentFees, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
    onError: (error) => {
      console.error("Error adding StudentFee:", error);
    },
  });
};

export const useRemoveStudentFee = () => {
  const queryClient = useQueryClient();
  return useMutation<IStudentFee, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IStudentFee> => {
      if (!Id) throw new Error("Id is required to remove a StudentFee");
      const response = await api.delete(`${StudentFeeEndPoints.removeStudentFees}/${Id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
  });
};

export const useEditStudentFee = () => {
  const queryClient = useQueryClient();
  return useMutation<IStudentFee, Error, { id: string | unknown; data: StudentFeeRequest }>({
    mutationFn: async ({ id, data }): Promise<IStudentFee> => {
      if (!id) throw new Error("Id is required to edit StudentFee");
      const response = await api.patch(`${StudentFeeEndPoints.updateStudentFees}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetAllStudentFees = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${StudentFeeEndPoints.getAllStudentFees}${params}`
        : StudentFeeEndPoints.getAllStudentFees;
      const response = await api.get<IPaginationResponse<IStudentFee>>(url);
      return response.data ?? { data: [], PageIndex: 0, isPagination: 1, pageSize: 10 };
    },
  });
};

export const useFilterStudentFeeByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${StudentFeeEndPoints.filterStudentFeeByDate}${params}`
        : StudentFeeEndPoints.filterStudentFeeByDate;
      const response = await api.get<IPaginationResponse<IStudentFee>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGetFeeStructureByClassId = (classId?: string) => {
  return useQuery({
    queryKey: ["feeStructureByClass", classId],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IFeeStructureByClass>>(
        `${StudentFeeEndPoints.feeStructureByClass}?classId=${classId}`
      );
      return response.data;
    },
    enabled: !!classId,
    staleTime: 0,
  });
};

export const useAddPaymentRecord = () => {
  const queryClient = useQueryClient();
  return useMutation<IPaymentRecord, Error, IPaymentRequest>({
    mutationFn: async (formData: IPaymentRequest): Promise<IPaymentRecord> => {
      const response = await api.post(StudentFeeEndPoints.addpaymentrecords, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [paymentRecordKey] });
    },
    onError: (error) => {
      console.error("Error adding payment record:", error);
    },
  });
};

export const useGetStudentFeesummary = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${StudentFeeEndPoints.studentfeesummary}${params}`
        : StudentFeeEndPoints.studentfeesummary;
      const response = await api.get<IPaginationResponse<Istudentfeesummary>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
export const useGetStudentFeeById = (id?: string) => {
  return useQuery({
    queryKey: [queryKey, "detail", id],
    queryFn: async () => {
      const response = await api.get<IStudentFee>(
        `${StudentFeeEndPoints.getAllStudentFees}/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};


// this is for fetching the class name .. testing .. might remove it letter after integrating in the class hook

export interface IClass {
  Id: string;
  name: string;
}

export const useGetClassById = (classId?: string) => {
  return useQuery({
    queryKey: ["class", classId],
    queryFn: async () => {
      if (!classId) return null;
      const response = await api.get<IClass>(`/api/Academics/SchoolClass/${classId}`);
      return response.data;
    },
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

