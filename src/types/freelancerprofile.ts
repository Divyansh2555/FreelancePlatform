// types/freelancer.ts

// =========================================================
// PROFILE
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
// CREATE PROFILE
// =========================================================

export type CreateFreelancerProfile = {
  title: string;
  bio?: string | null;
  skills?: string | null;
  experience: number;
  hourly_rate?: number | null;
  location?: string | null;
  profile_image?: File | null;
};


// =========================================================
// UPDATE PROFILE
// =========================================================

export type UpdateFreelancerProfile = {
  title: string;
  bio?: string | null;
  skills?: string | null;
  experience: number;
  hourly_rate?: number | null;
  location?: string | null;
  profile_image?: File | null;
};


// =========================================================
// FORM STATE
// =========================================================

export type FreelancerProfileForm = {
  title: string;
  bio: string;
  skills: string;
  experience: number;
  hourly_rate: number;
  location: string;
};


// =========================================================
// API RESPONSES
// =========================================================

export type FreelancerProfileResponse =
  FreelancerProfile;

export type FreelancerProfilesResponse =
  FreelancerProfile[];


// =========================================================
// API ERROR
// =========================================================

export type ApiError = {
  detail?: string;
};


// =========================================================
// IMAGE
// =========================================================

export type ProfileImage = {
  file: File | null;
  preview: string | null;
};
