import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { AddStaffPayload, RoleOption } from "../types/staff.types";

// Same backend endpoints used by SuperAdmin/khaneypaniadmin user & role management.
export const StaffEndpoints = {
  addUser: "/api/Authentication/AddUser",
  allRoles: "/api/Authentication/all-roles",
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["elitekhaneypani-roles"],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<RoleOption>>(StaffEndpoints.allRoles);
      return response.data;
    },
    select: (response) => response?.Items ?? [],
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddStaff = () => {
  return useMutation({
    mutationFn: async (payload: AddStaffPayload) => {
      const response = await api.post(StaffEndpoints.addUser, payload);
      return response.data;
    },
  });
};
