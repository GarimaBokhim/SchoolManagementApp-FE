import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { api } from "@/utils/instance";
import { Toast } from "@/components/Toast/toast";
import { ITokenPayload } from "@/app/auth/login/types/loginResponse";
import { SchoolProfile } from "../types/profile.types";

// Same backend endpoints used by khaneypaniadmin/Setup/School - self-contained for scalability.
export const ProfileEndpoints = {
  getSchoolById: "/api/SetupControllers/School",
  updateSchool: "/api/SetupControllers/UpdateSchool",
};

export const ProfileQueryKeys = {
  school: (schoolId: string) => ["elitekhaneypani-school-profile", schoolId],
};

// Reads schoolId directly off the JWT rather than trusting cached context/localStorage state.
export const getSchoolIdFromToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload: ITokenPayload = jwtDecode(token);
    return payload.SchoolId ?? null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Reads the user's role directly off the JWT role claim.
export const getRoleFromToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload: ITokenPayload = jwtDecode(token);
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const useGetSchoolProfile = () => {
  const schoolId = getSchoolIdFromToken();

  return useQuery({
    queryKey: ProfileQueryKeys.school(schoolId ?? ""),
    queryFn: async () => {
      const response = await api.get<SchoolProfile>(`${ProfileEndpoints.getSchoolById}/${schoolId}`);
      return response.data;
    },
    enabled: Boolean(schoolId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};


export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ profile, logo }: { profile: SchoolProfile; logo: File }) => {
      const data = new FormData();
      data.append("name", profile.name ?? "");
      data.append("address", profile.address ?? "");
      data.append("email", profile.email ?? "");
      data.append("shortName", profile.shortName ?? "");
      data.append("contactNumber", profile.contactNumber ?? "");
      data.append("contactPerson", profile.contactPerson ?? "");
      data.append("pan", profile.pan ?? "");
      data.append("institutionId", profile.institutionId ?? "");
      data.append("fiscalYearId", profile.fiscalYearId ?? "");
      data.append("academicYearId", profile.academicYearId ?? "");
      data.append("isEnable", String(profile.isEnabled ?? true));
      data.append("isDeleted", String(profile.isDeleted ?? false));
      data.append("billNumberGenerationTypeForPurchase", String(profile.billNumberGenerationTypeForPurchase ?? 0));
      data.append("billNumberGenerationTypeForSales", String(profile.billNumberGenerationTypeForSales ?? 0));
      data.append("logoUrl", logo);

      const response = await api.patch<SchoolProfile>(`${ProfileEndpoints.updateSchool}/${profile.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      Toast.success("Profile picture updated successfully");
      queryClient.invalidateQueries({ queryKey: ProfileQueryKeys.school(variables.profile.id) });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      Toast.error(error?.response?.data?.Message || "Failed to update profile picture");
    },
  });
};
