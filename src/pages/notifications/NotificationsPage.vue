<template>
  <div class="py-6">
    <div class="sm:mb-8 flex items-center justify-between">
      <div class="flex space-x-1 rounded-lg bg-gray-100 p-1">
        <Button
          v-for="filter in filters"
          :key="filter.id"
          :class="
            activeFilter === filter.id
              ? 'bg-primary!'
              : 'bg-gray-100! text-gray-500!'
          "
          @click="activeFilter = filter.id"
          size="sm"
          class="!rounded-md"
        >
          {{ filter.label }}
          <span
            v-if="filter.id === 'unread' && unreadCount > 0"
            class="ml-1 text-xs"
            :class="activeFilter === filter.id ? 'text-white' : 'text-gray-500'"
          >
            {{ unreadCount }}
          </span>
        </Button>
      </div>
      <Button
        @click="markAllAsRead"
        variant="secondary"
        size="lg"
        text="Mark all as read"
      />
    </div>
    <!-- Loading state -->
    <div v-if="notificationsStore.loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>

    <!-- Notifications list -->
    <NotificationsList
      v-else
      :notifications="filteredNotifications"
      @toggle-read="toggleNotificationRead"
      @delete="deleteNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useNotificationsStore } from "../../stores/notifications";
import NotificationsList from "../../components/notifications/NotificationsList.vue";
import Button from "../../components/ui/Button.vue";
import LoadingSpinner from "../../components/ui/LoadingSpinner.vue";

const notificationsStore = useNotificationsStore();

const filters = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "reports", label: "Reports" },
  { id: "training", label: "Training" },
  { id: "system", label: "System" },
  { id: "alerts", label: "Alerts" },
];

const activeFilter = ref("all");

const filteredNotifications = computed(() => {
  const notifications = notificationsStore.notifications;
  if (activeFilter.value === "all") return notifications;
  if (activeFilter.value === "unread")
    return notifications.filter((n) => !n.read);
  return notifications.filter((n) => n.type === activeFilter.value);
});

const unreadCount = computed(() => {
  return notificationsStore.notifications.filter((n) => !n.read).length;
});

const markAllAsRead = async () => {
  await notificationsStore.markAllAsRead();
};

const toggleNotificationRead = async (notification: { id: string }) => {
  await notificationsStore.toggleRead(notification.id);
};

const deleteNotification = async (id: string) => {
  await notificationsStore.deleteNotification(id);
};

onMounted(async () => {
  await notificationsStore.fetchNotifications();
});
</script>
