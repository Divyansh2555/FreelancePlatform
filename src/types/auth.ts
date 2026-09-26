export type UserRole =
  | "client"
  | "freelancer"
  | "admin";

export type User = {
  id: number | string;
  name: string;
  email: string;

  // Backend may return either role or user_role
  role?: UserRole;
  user_role?: UserRole;
};

export type LoginResponse = {
  message?: string;

  // Access token
  access_token?: string;
  token?: string;

  // Refresh token, if backend provides it
  refresh_token?: string;

  token_type?: "bearer" | string;

  // Logged-in user
  user?: User | null;

  // Some backend versions may return role directly
  role?: UserRole | string | null;
  user_role?: UserRole | string | null;

  detail?: string;
};

export type RegisterResponse = {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;

  message?: string;
  detail?: string;
};

export type ForgotPasswordResponse = {
  message: string;
  reset_token?: string;
  detail?: string;
};

export type ResetPasswordResponse = {
  message: string;
  detail?: string;
};
