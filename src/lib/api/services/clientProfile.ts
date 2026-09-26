import { apiFetch } from "../client";
import { endpoints } from "../endpoints";

import type {
  ClientProfile,
  CreateClientProfileData,
  UpdateClientProfileData,
} from "../../../types/clientprofile";

/**
 * =========================================================
 * GET CLIENT PROFILE
 * =========================================================
 *
 * GET /client/profile/
 *
 * Current logged-in client's profile.
 */
export async function getClientProfile(): Promise<ClientProfile> {
  return apiFetch<ClientProfile>(
    endpoints.client.profile,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
}

/**
 * =========================================================
 * CREATE CLIENT PROFILE
 * =========================================================
 *
 * POST /client/profile/
 *
 * New client profile create karta hai.
 *
 * FormData use kiya gaya hai because:
 * - profile_image upload ho sakti hai
 * - cover_image upload ho sakti hai
 *
 * IMPORTANT:
 * Content-Type manually set mat karna.
 * Browser automatically multipart/form-data boundary set karega.
 */
export async function createClientProfile(
  data: CreateClientProfileData
): Promise<ClientProfile> {
  const formData = new FormData();

  // -------------------------------------------------------
  // BASIC
  // -------------------------------------------------------

  formData.append(
    "company_name",
    data.company_name ?? ""
  );

  formData.append(
    "bio",
    data.bio ?? ""
  );

  formData.append(
    "location",
    data.location ?? ""
  );

  // -------------------------------------------------------
  // BUSINESS
  // -------------------------------------------------------

  formData.append(
    "website",
    data.website ?? ""
  );

  formData.append(
    "industry",
    data.industry ?? ""
  );

  formData.append(
    "company_size",
    data.company_size ?? ""
  );

  if (
    data.founded_year !== null &&
    data.founded_year !== undefined
  ) {
    formData.append(
      "founded_year",
      String(data.founded_year)
    );
  }

  // -------------------------------------------------------
  // CONTACT
  // -------------------------------------------------------

  formData.append(
    "phone",
    data.phone ?? ""
  );

  formData.append(
    "country",
    data.country ?? ""
  );

  formData.append(
    "timezone",
    data.timezone ?? ""
  );

  // -------------------------------------------------------
  // PROFILE IMAGE
  // -------------------------------------------------------

  if (data.profile_image) {
    formData.append(
      "profile_image",
      data.profile_image,
      data.profile_image.name
    );
  }

  // -------------------------------------------------------
  // COVER IMAGE
  // -------------------------------------------------------

  if (data.cover_image) {
    formData.append(
      "cover_image",
      data.cover_image,
      data.cover_image.name
    );
  }

  // -------------------------------------------------------
  // POST REQUEST
  // -------------------------------------------------------

  return apiFetch<ClientProfile>(
    endpoints.client.profile,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    }
  );
}

/**
 * =========================================================
 * UPDATE CLIENT PROFILE
 * =========================================================
 *
 * PUT /client/profile/
 *
 * Existing client profile update karta hai.
 *
 * Images bhi update ki ja sakti hain.
 */
export async function updateClientProfile(
  data: UpdateClientProfileData
): Promise<ClientProfile> {
  const formData = new FormData();

  // -------------------------------------------------------
  // BASIC
  // -------------------------------------------------------

  formData.append(
    "company_name",
    data.company_name ?? ""
  );

  formData.append(
    "bio",
    data.bio ?? ""
  );

  formData.append(
    "location",
    data.location ?? ""
  );

  // -------------------------------------------------------
  // BUSINESS
  // -------------------------------------------------------

  formData.append(
    "website",
    data.website ?? ""
  );

  formData.append(
    "industry",
    data.industry ?? ""
  );

  formData.append(
    "company_size",
    data.company_size ?? ""
  );

  if (
    data.founded_year !== null &&
    data.founded_year !== undefined
  ) {
    formData.append(
      "founded_year",
      String(data.founded_year)
    );
  }

  // -------------------------------------------------------
  // CONTACT
  // -------------------------------------------------------

  formData.append(
    "phone",
    data.phone ?? ""
  );

  formData.append(
    "country",
    data.country ?? ""
  );

  formData.append(
    "timezone",
    data.timezone ?? ""
  );

  // -------------------------------------------------------
  // PROFILE IMAGE
  // -------------------------------------------------------

  if (data.profile_image) {
    formData.append(
      "profile_image",
      data.profile_image,
      data.profile_image.name
    );
  }

  // -------------------------------------------------------
  // COVER IMAGE
  // -------------------------------------------------------

  if (data.cover_image) {
    formData.append(
      "cover_image",
      data.cover_image,
      data.cover_image.name
    );
  }

  // -------------------------------------------------------
  // PUT REQUEST
  // -------------------------------------------------------

  return apiFetch<ClientProfile>(
    endpoints.client.profile,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    }
  );
}

/**
 * =========================================================
 * UPDATE PROFILE WITHOUT IMAGES
 * =========================================================
 *
 * Optional helper.
 *
 * Sirf text/business/contact fields update karne ke liye.
 */
export async function updateClientProfileData(
  data: Omit<
    UpdateClientProfileData,
    "profile_image" | "cover_image"
  >
): Promise<ClientProfile> {
  return updateClientProfile(data);
}
