import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { Toast } from "@/components/Toast/toast";
import { IPaginationCrmResponse } from "@/types/IPaginationResponse";
import {
  AddWaterExpensePayload,
  AddWaterIncomePayload,
  AddWaterPaymentPayload,
  LookupOption,
  WaterExpense,
  WaterIncome,
  WaterPayment,
} from "../types/finance.types";

// Same backend endpoints used by khaneypaniadmin/(finance) - self-contained for scalability.
export const FinanceEndpoints = {
  payments: "/api/KhaneyPaniFinance/FilterWaterpayment",
  addPayment: "/api/KhaneyPaniFinance/AddWaterPayment",
  income: "/api/KhaneyPaniFinance/FilterWaterIncome",
  addIncome: "/api/KhaneyPaniFinance/AddWaterIncome",
  expenses: "/api/KhaneyPaniFinance/FilterWaterExpenses",
  addExpense: "/api/KhaneyPaniFinance/AddWaterExpenses",
  incomeSource: "/api/KhaneyPaniFinance/FilterWaterIncomeSource",
  expenseCategory: "/api/KhaneyPaniFinance/FilterWaterExpensesCategory",
  houseHolds: "/api/KhaneyPaniHouseHolds/FilterHouseHolds",
};

export const FinanceQueryKeys = {
  payments: ["elitekhaneypani-water-payments"],
  income: ["elitekhaneypani-water-income"],
  expenses: ["elitekhaneypani-water-expenses"],
  incomeSource: ["elitekhaneypani-water-income-source"],
  expenseCategory: ["elitekhaneypani-water-expense-category"],
  houseHolds: ["elitekhaneypani-finance-households"],
};

const LOOKUP_QUERY_PARAMS = { pageSize: 50, pageIndex: 1, isPagination: true };


export const useGetWaterPayments = (queryParams?: string) => {
  return useQuery({
    queryKey: [...FinanceQueryKeys.payments, queryParams],
    queryFn: async () => {
      const url = queryParams ? `${FinanceEndpoints.payments}${queryParams}` : FinanceEndpoints.payments;
      const response = await api.get<IPaginationCrmResponse<WaterPayment>>(url);
      return response.data.Data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useGetWaterIncome = (queryParams?: string) => {
  return useQuery({
    queryKey: [...FinanceQueryKeys.income, queryParams],
    queryFn: async () => {
      const url = queryParams ? `${FinanceEndpoints.income}${queryParams}` : FinanceEndpoints.income;
      const response = await api.get<IPaginationCrmResponse<WaterIncome>>(url);
      return response.data.Data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useGetWaterExpenses = (queryParams?: string) => {
  return useQuery({
    queryKey: [...FinanceQueryKeys.expenses, queryParams],
    queryFn: async () => {
      const url = queryParams ? `${FinanceEndpoints.expenses}${queryParams}` : FinanceEndpoints.expenses;
      const response = await api.get<IPaginationCrmResponse<WaterExpense>>(url);
      return response.data.Data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useGetHouseholdsForFinance = () => {
  return useQuery({
    queryKey: FinanceQueryKeys.houseHolds,
    queryFn: async () => {
      const response = await api.get<IPaginationCrmResponse<{ id: string; consumerName: string }>>(
        FinanceEndpoints.houseHolds,
        { params: LOOKUP_QUERY_PARAMS }
      );
      return response.data;
    },
    select: (response) => response?.Data.Items ?? [],
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetWaterIncomeSources = () => {
  return useQuery({
    queryKey: FinanceQueryKeys.incomeSource,
    queryFn: async () => {
      const response = await api.get<IPaginationCrmResponse<LookupOption>>(FinanceEndpoints.incomeSource, {
        params: LOOKUP_QUERY_PARAMS,
      });
      return response.data;
    },
    select: (response) => response?.Data.Items ?? [],
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetExpenseCategories = () => {
  return useQuery({
    queryKey: FinanceQueryKeys.expenseCategory,
    queryFn: async () => {
      const response = await api.get<IPaginationCrmResponse<LookupOption>>(FinanceEndpoints.expenseCategory, {
        params: LOOKUP_QUERY_PARAMS,
      });
      return response.data;
    },
    select: (response) => response?.Data.Items ?? [],
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddWaterPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddWaterPaymentPayload) => {
      const response = await api.post<IPaginationCrmResponse<WaterPayment>>(FinanceEndpoints.addPayment, payload);
      return response.data;
    },
    onSuccess: (response) => {
      Toast.success(response?.Message || "Payment added successfully");
      queryClient.invalidateQueries({ queryKey: FinanceQueryKeys.payments });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      Toast.error(error?.response?.data?.Message || "Failed to add payment");
    },
  });
};

export const useAddWaterIncome = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddWaterIncomePayload) => {
      const response = await api.post<IPaginationCrmResponse<WaterIncome>>(FinanceEndpoints.addIncome, payload);
      return response.data;
    },
    onSuccess: (response) => {
      Toast.success(response?.Message || "Income added successfully");
      queryClient.invalidateQueries({ queryKey: FinanceQueryKeys.income });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      Toast.error(error?.response?.data?.Message || "Failed to add income");
    },
  });
};

export const useAddWaterExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddWaterExpensePayload) => {
      const response = await api.post<IPaginationCrmResponse<WaterExpense>>(FinanceEndpoints.addExpense, payload);
      return response.data;
    },
    onSuccess: (response) => {
      Toast.success(response?.Message || "Expense added successfully");
      queryClient.invalidateQueries({ queryKey: FinanceQueryKeys.expenses });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      Toast.error(error?.response?.data?.Message || "Failed to add expense");
    },
  });
};

