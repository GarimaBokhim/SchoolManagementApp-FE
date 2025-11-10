import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IDistrict, IMunicipality, IProvince, IVdc } from "../types/ICommon";
const CommonEndPoints = {
  getAllProvince: "/api/SetupControllers/all-province",
  getDistrictByProvince: "/api/SetupControllers/District",
  getMunicipalityByDistrict: "/api/SetupControllers/GetMunicipality",
  getVDCByDistrict: "/api/SetupControllers/GetVDC",
};

const queryKey = "Province";
export const useGetAllProvince = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${CommonEndPoints.getAllProvince}${params}`
        : `${CommonEndPoints.getAllProvince}`;
      const response = await api.get<IPaginationResponse<IProvince>>(url);
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

export const useGetDistrictByProvince = (ProvinceId: number | null) => {
  return useQuery({
    queryKey: [queryKey, ProvinceId],
    queryFn: async (): Promise<IDistrict[]> => {
      if (!ProvinceId) {
        throw new Error("ProvinceId is required to get a District");
      }
      const response = await api.get<IDistrict[]>(
        `${CommonEndPoints.getDistrictByProvince}/${ProvinceId}`
      );
      return response.data;
    },
    enabled: !!ProvinceId,
    staleTime: 0,
    retry: false,
  });
};
export const useGetMunicipalityByDistrict = (DistrictId: number | null) => {
  return useQuery({
    queryKey: [queryKey, DistrictId],
    queryFn: async (): Promise<IMunicipality[]> => {
      if (!DistrictId) {
        throw new Error("DistrictId is required to get a Municipality");
      }
      const response = await api.get<IMunicipality[]>(
        `${CommonEndPoints.getMunicipalityByDistrict}/${DistrictId}`
      );
      return response.data;
    },
    enabled: !!DistrictId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetVDCByDistrict = (DistrictId: number | null) => {
  return useQuery({
    queryKey: [queryKey, DistrictId],
    queryFn: async (): Promise<IVdc[]> => {
      if (!DistrictId) {
        throw new Error("DistrictId is required to get a Municipality");
      }
      const response = await api.get<IVdc[]>(
        `${CommonEndPoints.getVDCByDistrict}/${DistrictId}`
      );
      return response.data;
    },
    enabled: !!DistrictId,
    staleTime: 0,
    retry: false,
  });
};
