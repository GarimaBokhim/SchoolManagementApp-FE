import { useMutation } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IEliteLoginPayload, IEliteRegisterPayload } from "../types/auth.types";

// Same backend endpoints used by the main web login/register forms.
const AuthEndpoints = {
  login: "/api/Authentication/login",
  register: "/api/Authentication/Register",
};

export const useEliteLogin = () => {
  return useMutation({
    mutationFn: async (data: IEliteLoginPayload) => {
      const response = await api.post(AuthEndpoints.login, data);
      return response.data;
    },
  });
};

export const useEliteRegister = () => {
  return useMutation({
    mutationFn: async (data: IEliteRegisterPayload) => {
      const response = await api.post(AuthEndpoints.register, {
        Username: data.username,
        Email: data.email,
        ContactNumber: data.contactNumber,
        Password: data.password,
      });
      return response.data;
    },
  });
};
