import { defineStore } from "pinia";
import { authApi } from "../api/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as { email: string } | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async register(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        await authApi.register(email, password);
        this.user = { email };
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Registration failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        await authApi.login(email, password);
        this.user = { email };
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      this.error = null;
      try {
        await authApi.logout();
        this.user = null;
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Logout failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email: string) {
      this.loading = true;
      this.error = null;
      try {
        await authApi.forgotPassword(email);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Password reset request failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(token: string, newPassword: string) {
      this.loading = true;
      this.error = null;
      try {
        await authApi.resetPassword(token, newPassword);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Password reset failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
