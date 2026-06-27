import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationCrmResponse, IPaginationResponse } from '@/types/IPaginationResponse'
import { AddPaymentsPayload, AddPaymentsResponse, PaymentsResponse, SchoolResponse, UpdatePaymentsPayload } from '../types/IPayments'
import { Toast } from '@/components/Toast/toast'


export const paymentsEndPoints = {
  filter: '/api/CrmFinance/FilterPayments',
  add: '/api/CrmFinance/AddPayments',
  update: '/api/CrmFinance/UpdatePayments',
  delete: '/api/CrmFinance/DeletePayments',
  applicants: '/api/Enrolments/AllApplicant',
  get: '/api/CrmFinance/PaymentsById',
  getSchoolById: '/api/SetupControllers/School',
  filterInvoice: '/api/CrmFinance/FilterInvoice',
}


export const paymentsQueryKey = {
  invoice:['Invoice'],
  all: ['payments'],
  applicants: ['Applicants'],
}

const normalizePaymentsPayload = (data: UpdatePaymentsPayload): UpdatePaymentsPayload => ({
  invoiceId: String(data.invoiceId ?? '').trim(),
  amount: Number(data.amount) || 0,
  paymentDate: String(data.paymentDate ?? '').trim(),
  paymentMethod: Number(data.paymentMethod) || 0,
})

export const normalizePayments = (
  data: Partial<PaymentsResponse> | null | undefined
  ): PaymentsResponse => {
    return {
      id: String(data?.id ?? ''),
      invoiceId: String(data?.invoiceId ?? ''),
      amount: Number(data?.amount ?? 0),
      applicantId: String(data?.applicantId ?? '').trim(),
      applicantName: String(data?.applicantName ?? '').trim(),
      invoiceNumber: String(data?.invoiceNumber ?? '').trim(),
      paymentDate: String(data?.paymentDate ?? ''),
      paymentMethod: Number(data?.paymentMethod ?? 0),
      referenceNumber: String(data?.referenceNumber ?? '').trim(),
      paymentStatus: Number(data?.paymentStatus ?? 0),
      isActive: Boolean(data?.isActive ?? false),
      schoolId: String(data?.schoolId ?? ''),
      createdBy: String(data?.createdBy ?? ''),
      createdAt: String(data?.createdAt ?? ''),
      modifiedBy: String(data?.modifiedBy ?? ''),
      modifiedAt: String(data?.modifiedAt ?? ''),
    }
  }


export const useGetAllPayments = (queryParams?: string) => {
    return useQuery({
      queryKey: [...paymentsQueryKey.all, queryParams],
      queryFn: async () => {
        const url = queryParams
          ? `${paymentsEndPoints.filter}${queryParams}`
          : paymentsEndPoints.filter
        const response =
          await api.get<IPaginationCrmResponse<PaymentsResponse>>(url)
        return response.data.Data
      },
      staleTime: 1000 * 60 * 5,
      retry: false,
    })
  }

export const useAddPayments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddPaymentsPayload) => {
      const normalizedPayload = normalizePaymentsPayload(payload);

      const response = await api.post<IPaginationCrmResponse<AddPaymentsResponse>>(
        paymentsEndPoints.add,
        normalizedPayload
      );

      return response.data;
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || "Payments added successfully");

      // ✅ refresh payments list
      queryClient.invalidateQueries({
        queryKey: paymentsQueryKey.all,
      });

      queryClient.invalidateQueries({
        queryKey: ['Invoice'], 
      });
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || "Failed to add Payments"
      );
    },
  });
};

export const useDeletePayments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${paymentsEndPoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Invoice deleted successfully')

      queryClient.invalidateQueries({
        queryKey: paymentsQueryKey.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete invoice'
      )
    },
  })
}

export const useEditPayments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdatePaymentsPayload
    }) => {
      const response = await api.patch(
        `${paymentsEndPoints.update}/${id}`,
        normalizePaymentsPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Payments updated successfully')

      queryClient.invalidateQueries({
        queryKey: paymentsQueryKey.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Payments'
      )
    },
  })
}


export const useGetPaymentsById = (paymentId?: string) => {
  return useQuery({
    queryKey: [...paymentsQueryKey.all, paymentId],

    queryFn: async (): Promise<PaymentsResponse> => {
      const response = await api.get<PaymentsResponse>(
        `${paymentsEndPoints.get}/${paymentId}`
      )

      return normalizePayments(response.data)
    },

    enabled: !!paymentId,

    staleTime: 1000 * 60 * 5,

    retry: false,
  })
}


export const useGetAllApplicants = () => {
  return useQuery({
      queryKey: paymentsQueryKey.applicants,
  
      queryFn: async () => {
        const response = await api.get<
          IPaginationCrmResponse<{
            id: string
            fullName: string
          }>
        >(paymentsEndPoints.applicants)
  
        return response.data
      },
  
      select: (response) => response?.Data.Items ?? [],
  
      staleTime: 1000 * 60 * 5,
    })
}

export const useSchoolById = (SchoolId: string| null) => {
  return useQuery({
    queryKey: ["schoolId", SchoolId],

    queryFn: async (): Promise<SchoolResponse> => {
      if (!SchoolId) {
        throw new Error("Id is required to get School");
      }

      const response = await api.get<SchoolResponse>(
        `${paymentsEndPoints.getSchoolById}/${SchoolId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useGetAllInvoice = () => {
  return useQuery({
    queryKey: paymentsQueryKey.invoice,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          invoiceNumber: string
        }>
      >(paymentsEndPoints.filterInvoice)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}

