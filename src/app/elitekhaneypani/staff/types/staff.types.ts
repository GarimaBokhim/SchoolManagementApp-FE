export interface RoleOption {
  Id: string;
  Name: string;
}

export interface AddStaffPayload {
  userName: string;
  email: string;
  password: string;
  rolesId: string[];
  institutionId: string;
  schoolIds: string[];
}
