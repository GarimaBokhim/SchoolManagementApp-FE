import { useState, useEffect } from "react";
import { api } from "@/utils/instance";

interface IntakeItem {
  id: string;
  month: number;
  deadline: string;
  isOpen: boolean;
  courseId: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface ApiResponse {
  Items: IntakeItem[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

interface UseIntakesReturn {
  intakes: IntakeItem[];
  isLoading: boolean;
  error: string | null;
  fetchIntakes: (queryParams?: string) => Promise<void>;
  clearError: () => void;
}

const useIntakes = (): UseIntakesReturn => {
  const [intakes, setIntakes] = useState<IntakeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIntakes = async (queryParams?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const paramObj: Record<string, unknown> = {};
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => {
          paramObj[key] = value;
        });
      }
      const response = await api.get<ApiResponse>(
        "api/AcademicPrograms/FilterIntake",
        { params: paramObj }
      );
      setIntakes(response.data?.Items ?? []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? err?.message ?? "Something went wrong."
      );
      setIntakes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchIntakes();
  }, []);

  return { intakes, isLoading, error, fetchIntakes, clearError };
};

export type { IntakeItem };
export default useIntakes;