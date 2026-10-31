
export const endpoints = {
  auth: {
    login: "api/v1/auth/login",
    register: "api/v1/auth/register",
    forgotPassword: "api/v1/auth/forgot-password",
    resetPassword: "api/v1/auth/reset-password",
    logout: "api/v1/auth/logout",
    me: "api/v1/auth/me",

  },

  client: {
    profile: "/client/profile/",
  },

  chat: {
    users: "/chat/users",

    conversation: "/chat/conversation",

    messages: (conversationId: number | string) =>
      `/chat/${conversationId}/messages`,
  },

  freelancer: {
    profile: "/freelancer/profile/",

    get: (profileId: number | string) =>
      `/freelancer/profile/${profileId}`,

    update: (profileId: number | string) =>
      `/freelancer/profile/${profileId}`,

    delete: (profileId: number | string) =>
      `/freelancer/profile/${profileId}`,
  },




};