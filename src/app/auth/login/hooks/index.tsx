import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { ILoginType } from "../types/loginResponse";
const loginEndPoint = {
  register: "/api/Authentication/Register",
  login: "/api/Authentication/login",
};
type LoginRequest = {
  email: string | null;
  password: string | null;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<ILoginType, Error, LoginRequest>({
   mutationFn: async (data: LoginRequest) => {
  if (!data.email || !data.password) {
    throw new Error("Email and Password are required");
  }
const response = await api.post(loginEndPoint.login, data);

return {
  email: response.data.email ?? null,
  password: response.data.password ?? null, 
  token: response.data.token ?? null,
  refreshToken: response.data.refreshToken ?? null,
};
},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.refetchQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      console.error("Error while logging in:", error);
    },
  });
};
