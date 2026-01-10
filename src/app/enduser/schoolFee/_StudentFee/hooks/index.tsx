import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IPaymentRecord, IStudentFee } from "../types/IStudentFee";
const StudentFeeEndPoints = {
  getAllStudentFees: "/api/Finance/StudentFee",
  createStudentFees: "/api/Finance/AddStudentFee",
  removeStudentFees: "/api/Finance/DeleteStudentFees",
  updateStudentFees: "/api/Finance/UpdateStudentFees",
  filterStudentFeeByDate: "/api/Finance/FilterStudentFee",
  addpaymentrecords: "/api/Finance/AddPaymentsRecords",
};

const queryKey = "StudentFees";
const filterQueryKey = "filteredStudentFee";
const paymentRecordKey = "PaymentRecords";
type StudentFeeRequest = {
  id?: string;
  studentId: string;
  feeStructureId: string[];
  classId: string;
  discountPercentage: number;
};
type IPaymentRequest = {
  studentfeeId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: number;
  reference: string;
}

export const useAddStudentFee = () => {
  const queryClient = useQueryClient();

  return useMutation<IStudentFee, Error, StudentFeeRequest>({
    mutationFn: async (formData: StudentFeeRequest): Promise<IStudentFee> => {
      const response = await api.post(
        StudentFeeEndPoints.createStudentFees,
        formData
      );
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
      if (!Id) {
        throw new Error("Id is required to remove a StudentFee");
      }
      const response = await api.delete(
        `${StudentFeeEndPoints.removeStudentFees}/${Id}`
      );
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
  return useMutation<
    IStudentFee,
    Error,
    { id: string | unknown; data: StudentFeeRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IStudentFee> => {
      if (!id) {
        throw new Error("Ïd is required to edit StudentFee");
      }
      const response = await api.patch(
        `${StudentFeeEndPoints.updateStudentFees}/${id}`,
        data
      );
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
        : `${StudentFeeEndPoints.getAllStudentFees}`;
      const response = await api.get<IPaginationResponse<IStudentFee>>(url);
      return (
        response.data ?? {
          data: [],
          PageIndex: 0,
          isPagination: 1,
          pageSize: 10,
        }
      );
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

export const useAddPaymentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation<IPaymentRecord, Error, IPaymentRequest>({
    mutationFn: async (formData: IPaymentRequest): Promise<IPaymentRecord> => {
      const response = await api.post(
        StudentFeeEndPoints.addpaymentrecords,
        formData
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [paymentRecordKey] });
    },

    onError: (error) => {
      console.error("Error adding StudentFee:", error);
    },
  });
};
