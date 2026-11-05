import { apiFetch } from "../../client";
import { endpoints } from "../../endpoints";

export const freelancerApi = {
  // GET ALL PROFILES
  getProfiles: () =>
    apiFetch(endpoints.freelancer.profile, {
      method: "GET",
    }),

  // GET SINGLE PROFILE
  getProfile: (profileId: number | string) =>
    apiFetch(endpoints.freelancer.get(profileId), {
      method: "GET",
    }),

  // CREATE PROFILE
  createProfile: (formData: FormData) =>
    apiFetch(endpoints.freelancer.profile, {
      method: "POST",
      body: formData,
    }),

  // UPDATE PROFILE
  updateProfile: (
    profileId: number | string,
    formData: FormData
  ) =>
    apiFetch(endpoints.freelancer.update(profileId), {
      method: "PUT",
      body: formData,
    }),

  // DELETE PROFILE
  deleteProfile: (profileId: number | string) =>
    apiFetch(endpoints.freelancer.delete(profileId), {
      method: "DELETE",
    }),
};