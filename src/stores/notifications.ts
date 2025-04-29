import { defineStore } from "pinia";
import { notificationsApi } from "../api/api";

export interface Notification {
  id: string;
  title: string;
  timestamp: Date;
  read: boolean;
  type: "reports" | "training" | "system" | "alerts";
}

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [] as Notification[],
    isLoading: false,
  }),

  actions: {
    async fetchNotifications() {
      this.isLoading = true;
      try {
        this.notifications = await notificationsApi.getNotifications();
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async deleteNotification(id: string) {
      try {
        await notificationsApi.deleteNotification(id);
        this.notifications = this.notifications.filter((n) => n.id !== id);
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },

    async toggleRead(id: string) {
      try {
        const updatedNotification =
          await notificationsApi.toggleNotificationRead(id);
        this.notifications = this.notifications.map((notification) =>
          notification.id === id ? updatedNotification : notification
        );
      } catch (error) {
        console.error("Failed to toggle notification read status:", error);
      }
    },

    async markAllAsRead() {
      try {
        const updatedNotifications = await notificationsApi.markAllAsRead();
        this.notifications = updatedNotifications.map((notification) => ({
          ...notification,
          read: true,
        }));
      } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
      }
    },
  },
});
