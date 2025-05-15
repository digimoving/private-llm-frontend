import { defineStore } from "pinia";
import { accountApi } from "../api/api";

interface LoadingState {
  updatePreferences: boolean;
  updatePassword: boolean;
  updateEmail: boolean;
  delete: boolean;
}

export const useAccountStore = defineStore("account", {
  state: () => ({
    preferences: {
      darkMode: false,
    },
    loading: {
      updatePreferences: false,
      updatePassword: false,
      updateEmail: false,
      delete: false,
    } as LoadingState,
    error: null as string | null,
  }),

  getters: {
    isLoading: (state): boolean => {
      return Object.values(state.loading).some(
        (value: boolean) => value === true
      );
    },
  },

  actions: {
    async updateAccountPreferences(preferences: { darkMode?: boolean }) {
      try {
        this.loading.updatePreferences = true;
        this.error = null;
        await accountApi.updatePreferences(preferences);
        this.preferences = { ...this.preferences, ...preferences };
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to update preferences:", error);
        throw error;
      } finally {
        this.loading.updatePreferences = false;
      }
    },

    async updatePassword(currentPassword: string, newPassword: string) {
      try {
        this.loading.updatePassword = true;
        this.error = null;
        await accountApi.updatePassword(currentPassword, newPassword);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to update password:", error);
        throw error;
      } finally {
        this.loading.updatePassword = false;
      }
    },

    async updateEmail(newEmail: string) {
      try {
        this.loading.updateEmail = true;
        this.error = null;
        await accountApi.updateEmail(newEmail);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to update email:", error);
        throw error;
      } finally {
        this.loading.updateEmail = false;
      }
    },

    async deleteAccount(confirmEmail: string) {
      try {
        this.loading.delete = true;
        this.error = null;
        await accountApi.delete(confirmEmail);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to delete account:", error);
        throw error;
      } finally {
        this.loading.delete = false;
      }
    },
  },
});
