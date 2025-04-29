<!-- NotificationsList.vue -->
<template>
  <div>
    <div
      v-if="notifications.length === 0"
      class="flex items-center justify-center py-8"
    >
      <p class="text-gray-500">No notifications to display</p>
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="relative"
      >
        <div
          class="flex items-start justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div class="flex items-start space-x-4">
            <!-- Notification Icon based on type -->
            <div class="mt-1">
              <DocumentChartBarIcon
                v-if="notification.type === 'reports'"
                class="h-5 w-5"
                :class="notification.read ? 'text-gray-600' : 'text-blue-500'"
              />
              <CommandLineIcon
                v-else-if="notification.type === 'training'"
                class="h-5 w-5"
                :class="notification.read ? 'text-gray-600' : 'text-green-500'"
              />
              <Cog6ToothIcon
                v-else-if="notification.type === 'system'"
                class="h-5 w-5"
                :class="notification.read ? 'text-gray-600' : 'text-purple-500'"
              />
              <ExclamationCircleIcon
                v-else-if="notification.type === 'alerts'"
                class="h-5 w-5"
                :class="notification.read ? 'text-gray-600' : 'text-red-500'"
              />
            </div>

            <!-- Notification Content -->
            <div class="flex-1">
              <p
                :class="[
                  'text-sm',
                  notification.read
                    ? 'text-gray-600 font-normal'
                    : 'text-gray-900 font-medium',
                ]"
              >
                {{ notification.title }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{
                  useDateFormat(notification.timestamp, "MMM D, YYYY, HH:mm A")
                }}
              </p>
            </div>
          </div>

          <!-- Action Menu -->
          <ActionMenu
            :items="getMenuItems(notification)"
            @menu-click="(action) => handleMenuAction(action, notification)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from "../../stores/notifications";
import { useDateFormat } from "@vueuse/core";
import ActionMenu from "../ui/ActionMenu.vue";
import {
  DocumentChartBarIcon,
  CommandLineIcon,
  Cog6ToothIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import type { MenuItemType } from "../ui/ActionMenu.vue";

const props = defineProps<{
  notifications: Notification[];
}>();

const emit = defineEmits<{
  (e: "toggleRead", notification: Notification): void;
  (e: "delete", id: string): void;
}>();

const getMenuItems = (notification: Notification): MenuItemType[] => [
  {
    action: "toggle-read",
    label: notification.read ? "Mark as Unread" : "Mark as Read",
    class: "text-gray-700",
    activeClass: "bg-gray-100 text-gray-900",
    icon: notification.read ? EnvelopeIcon : EnvelopeOpenIcon,
  },
  {
    action: "delete",
    label: "Delete",
    class: "text-red-600",
    activeClass: "bg-red-50",
    icon: TrashIcon,
  },
];

const handleMenuAction = (action: string, notification: Notification) => {
  if (action === "toggle-read") {
    emit("toggleRead", notification);
  } else if (action === "delete") {
    emit("delete", notification.id);
  }
};
</script>
