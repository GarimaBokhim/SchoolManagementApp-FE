import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IStudent } from "../types/IStudents";
const StudentEndPoints = {
  getAllStudents: "/api/Student/all-Students",
  createStudents: "/api/Student/AddStudents",
  removeStudents: "/api/Student/DeleteStudents",
  updateStudents: "/api/Student/UpdateStudents",
  getStudentsById: "/api/Student/StudentsBy",
  filterStudentByDate: "/api/Student/FilterStudents",
};

const queryKey = "Students";
const filterQueryKey = "filteredStudent";
type StudentRequest = {
  id?: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  registrationNumber: string;
  genderStatus: 0;
  studentStatus: 0;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  address: string;
  enrollmentDate: Date;
  parentId: string;
  classSectionId?: string | null;
  provinceId: number;
  districtId: number;
  wardNumber?: number | null;
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation<IStudent, Error, StudentRequest>({
    mutationFn: async (data: StudentRequest): Promise<IStudent> => {
      console.log("Add Student", data);
      const response = await api.post(StudentEndPoints.createStudents, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
    onError: (error) => {
      console.error("Error adding Student:", error);
    },
  });
};

export const useRemoveStudent = () => {
  const queryClient = useQueryClient();
  return useMutation<IStudent, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IStudent> => {
      if (!Id) {
        throw new Error("Id is required to remove a Student");
      }
      const response = await api.delete(
        `${StudentEndPoints.removeStudents}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
  });
};

export const useEditStudent = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IStudent,
    Error,
    { id: string | unknown; data: StudentRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IStudent> => {
      if (!id) {
        throw new Error("Ïd is required to edit Student");
      }
      const response = await api.patch(
        `${StudentEndPoints.updateStudents}/${id}`,
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

export const useGetStudentById = (StudentId: string) => {
  return useQuery({
    queryKey: [queryKey, StudentId],
    queryFn: async (): Promise<IStudent> => {
      if (!StudentId) {
        throw new Error("Id is required to get a Student");
      }
      const response = await api.get<IStudent>(
        `${StudentEndPoints.getStudentsById}/${StudentId}`
      );
      return response.data;
    },
    enabled: !!StudentId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllStudents = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${StudentEndPoints.getAllStudents}${params}`
        : `${StudentEndPoints.getAllStudents}`;
      const response = await api.get<IPaginationResponse<IStudent>>(url);
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

export const useFilterStudentByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${StudentEndPoints.filterStudentByDate}${params}`
        : StudentEndPoints.filterStudentByDate;
      const response = await api.get<IPaginationResponse<IStudent>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
