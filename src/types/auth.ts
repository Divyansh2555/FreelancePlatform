export type UserRole =
  | "client"
  | "freelancer"
  | "admin";

export type User = {
  id?: number | string;
  name?: string;
  email?: string;
  role?: UserRole;
  user_role?: UserRole;
};

export type LoginResponse = {
  access_token?: string;
  refresh_token?: string;
  token?: string;

  role?: UserRole;
  user_role?: UserRole;

  message?: string;
  detail?: string;

  user?: User;
};

export type RegisterResponse = {
  id?: number | string;
  name?: string;
  email?: string;

  role?: UserRole;
  user_role?: UserRole;

  message?: string;
  detail?: string;
};