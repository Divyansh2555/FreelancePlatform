// types/freelancerprofile.ts

// =========================================================
// FREELANCER PROFILE
// =========================================================

export type FreelancerProfile = {
  id: number;
  user_id: number;

  title: string;
  bio: string | null;
  skills: string | null;

  experience: number;
  hourly_rate: number | null;
  location: string | null;

  profile_image: string | null;
};


// =========================================================
// PROFILE FORM
// =========================================================

export type ProfileForm = {
  title: string;
  bio: string;
  skills: string;
  experience: number;
  hourly_rate: number;
  location: string;
};


// =========================================================
// API RESPONSE
// =========================================================

export type ApiResponse<T> = {
  data?: T;
  results?: T;
  detail?: string;
  message?: string;
};


// =========================================================
// API ERROR
// =========================================================

export type ApiError = {
  message?: string;
  detail?: string;
};


// =========================================================
// IMAGE
// =========================================================

export type ProfileImage = {
  file: File | null;
  preview: string | null;
};


// =========================================================
// API RESPONSE TYPES
// =========================================================

export type FreelancerProfileResponse =
  ApiResponse<FreelancerProfile>;

export type FreelancerProfilesResponse =
  ApiResponse<FreelancerProfile[]>;