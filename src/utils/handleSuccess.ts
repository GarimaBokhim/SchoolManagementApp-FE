// utils/handleSuccess.ts

export const handleSuccess = (res: any): string => {
  return res?.message || "Operation successful!";
};