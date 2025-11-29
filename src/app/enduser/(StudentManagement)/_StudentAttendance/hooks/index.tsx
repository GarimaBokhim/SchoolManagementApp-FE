import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import {
  IAllAttendance,
  IStudentAttendance,
  IStudentList,
} from "../types/IStudentAttendance";
const StudentAttendanceEndPoints = {
  getAllStudentAttendances: "/api/Student/all-StudentAttendances",
  createStudentAttendances: "/api/Student/AddStudentAttendence",
  filterStudentAttendanceByDate: "/api/Student/FilterStudentsAttendance",
};

const queryKey = "StudentAttendances";
const filterStudentAttendanceQueryKey = "filteredStudentAttendance";
type StudentAttendanceRequest = {
  id?: string;
  academicTeamId: string;
  attendanceDate: Date;
  studentAttendances: IStudentList[];
};

export const useAddStudentAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation<IStudentAttendance, Error, StudentAttendanceRequest>({
    mutationFn: async (
      data: StudentAttendanceRequest
    ): Promise<IStudentAttendance> => {
      console.log("Add StudentAttendance", data);
      const response = await api.post(
        StudentAttendanceEndPoints.createStudentAttendances,
        data
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [filterStudentAttendanceQueryKey],
      });
    },
    onError: (error) => {
      console.error("Error adding StudentAttendance:", error);
    },
  });
};

export const useGetAllStudentAttendances = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${StudentAttendanceEndPoints.getAllStudentAttendances}${params}`
        : `${StudentAttendanceEndPoints.getAllStudentAttendances}`;
      const response = await api.get<IPaginationResponse<IStudentAttendance>>(
        url
      );
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

export const useFilterStudentAttendanceByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterStudentAttendanceQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${StudentAttendanceEndPoints.filterStudentAttendanceByDate}${params}`
        : StudentAttendanceEndPoints.filterStudentAttendanceByDate;
      const response = await api.get<IPaginationResponse<IAllAttendance>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
