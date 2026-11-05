/**
 * =========================================================
 * CLIENT PROFILE RESPONSE
 * =========================================================
 *
 * GET /client/profile/
 * POST /client/profile/
 * PUT /client/profile/
 *
 * Backend se profile object isi shape me aata hai.
 */
export interface ClientProfile {
  id: number;
  user_id: number;

  company_name: string | null;
  bio: string | null;
  location: string | null;

  profile_image_url: string | null;
  cover_image_url: string | null;

  website: string | null;
  industry: string | null;
  company_size: string | null;
  founded_year: number | null;

  phone: string | null;
  country: string | null;
  timezone: string | null;

  jobs_posted: number;
  hires: number;
  active_jobs: number;
  reviews_count: number;
  rating: number;

  is_verified: boolean;

  created_at: string | null;
  updated_at: string | null;
}

/**
 * =========================================================
 * CREATE CLIENT PROFILE
 * =========================================================
 *
 * POST /client/profile/
 *
 * Profile create karte waqt frontend se bhejne wala data.
 *
 * Images File ke form me jayengi.
 * Request FormData hogi.
 */
export interface CreateClientProfileData {
  company_name: string;
  bio: string;
  location: string;

  website?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number | null;

  phone?: string;
  country?: string;
  timezone?: string;

  profile_image?: File | null;
  cover_image?: File | null;
}

/**
 * =========================================================
 * UPDATE CLIENT PROFILE
 * =========================================================
 *
 * PUT /client/profile/
 *
 * Existing profile update karne ke liye.
 *
 * Saare fields optional rakhe gaye hain taaki partial
 * update payload bhi easily ban sake.
 */
export interface UpdateClientProfileData {
  company_name?: string;
  bio?: string;
  location?: string;

  website?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number | null;

  phone?: string;
  country?: string;
  timezone?: string;

  profile_image?: File | null;
  cover_image?: File | null;
}

/**
 * =========================================================
 * OPTIONAL: UPDATE DATA WITHOUT IMAGES
 * =========================================================
 *
 * Agar kabhi sirf text/business information update karni ho.
 */
export type UpdateClientProfileFields = Omit<
  UpdateClientProfileData,
  "profile_image" | "cover_image"
>;

/**
 * =========================================================
 * OPTIONAL: CREATE RESPONSE
 * =========================================================
 *
 * Normally POST ka response bhi ClientProfile hi hoga,
 * isliye separate interface ki zarurat nahi hai.
 */
export type CreateClientProfileResponse = ClientProfile;

/**
 * =========================================================
 * OPTIONAL: UPDATE RESPONSE
 * =========================================================
 */
export type UpdateClientProfileResponse = ClientProfile;

/**
 * =========================================================
 * GET RESPONSE
 * =========================================================
 */
export type GetClientProfileResponse = ClientProfile;
