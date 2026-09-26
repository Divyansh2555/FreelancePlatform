
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    logout: "/auth/logout",
    me: "/auth/me",

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
};