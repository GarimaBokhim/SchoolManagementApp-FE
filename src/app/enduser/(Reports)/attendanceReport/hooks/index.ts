import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IAttendanceReport, IStudentListResponse } from "../types/Iattendance";

const AttendanceEndPoints = {
  getReport: "/api/SchoolReportsControllers/AttendanceReport",
  getAllStudents: "/api/Student/all-Students",
};

const attendanceQueryKey = "attendanceReport";
const studentQueryKey = "allStudents";

export const useGetAttendanceReport = (nameOfMonths: number, classId: string) => {
  return useQuery({
    queryKey: [attendanceQueryKey, nameOfMonths, classId],
    queryFn: async (): Promise<IAttendanceReport> => {
      const response = await api.get<IAttendanceReport>(
        `${AttendanceEndPoints.getReport}?nameOfMonths=${nameOfMonths}&classId=${classId}`
      );
      return response.data;
    },
    enabled: !!classId, // only fetch when classId is available
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllStudents = () => {
  return useQuery({
    queryKey: [studentQueryKey],
    queryFn: async (): Promise<IStudentListResponse> => {
      const response = await api.get<IStudentListResponse>(
        AttendanceEndPoints.getAllStudents
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};