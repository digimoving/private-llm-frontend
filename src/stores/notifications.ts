import { defineStore } from "pinia";
import { notificationsApi } from "../api/api";
import type { Notification } from "../types/types";

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export const useNotificationsStore = defineStore("notifications", {
  state: (): NotificationsState => ({
    notifications: [],
    loading: false,
    error: null,
  }),

  getters: {
    unreadCount: (state) =>
      state.notifications.filter((n: Notification) => !n.read).length,
  },

  actions: {
    async fetchNotifications() {
      this.loading = true;
      this.error = null;
      try {
        this.notifications = await notificationsApi.list();
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to fetch notifications";
      } finally {
        this.loading = false;
      }
    },

    async deleteNotification(id: string) {
      try {
        await notificationsApi.delete(id);
        this.notifications = this.notifications.filter((n) => n.id !== id);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to delete notification";
      }
    },

    async toggleRead(id: string) {
      try {
        await notificationsApi.toggleRead(id);
        const index = this.notifications.findIndex((n) => n.id === id);
        if (index !== -1) {
          // Create a new array with the updated notification to trigger reactivity
          this.notifications = [
            ...this.notifications.slice(0, index),
            {
              ...this.notifications[index],
              read: !this.notifications[index].read,
            },
            ...this.notifications.slice(index + 1),
          ];
        }
      } catch (err) {
        this.error =
          err instanceof Error
            ? err.message
            : "Failed to toggle notification read status";
      }
    },

    async markAllAsRead() {
      try {
        await notificationsApi.markAllRead();
        this.notifications = this.notifications.map((n) => ({
          ...n,
          read: true,
        }));
      } catch (err) {
        this.error =
          err instanceof Error
            ? err.message
            : "Failed to mark all notifications as read";
      }
    },
  },
});
