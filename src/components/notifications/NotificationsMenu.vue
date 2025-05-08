<template>
  <Menu as="div" class="relative" v-slot="{ close }">
    <div>
      <MenuButton
        class="relative flex rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer transition-colors duration-200"
        aria-label="Notifications"
      >
        <span class="sr-only">View notifications</span>
        <BellIcon class="h-6 w-6" aria-hidden="true" />
        <span
          v-if="unreadCount > 0"
          class="absolute top-0.75 right-0.75 h-2.5 w-2.5 bg-primary-500 rounded-full"
        />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        <div
          class="px-4 py-2 flex items-center justify-between border-b border-gray-100"
        >
          <h3 class="font-semibold text-gray-900">Notifications</h3>
          <Button
            variant="flat"
            size="xs"
            text="Mark all as read"
            class="text-primary-600 hover:text-primary-500"
            @click="$emit('markAllAsRead')"
          />
        </div>

        <div class="max-h-96 overflow-y-auto">
          <MenuItem
            v-for="notification in notifications"
            :key="notification.id"
            v-slot="{ active }"
          >
            <Button
              variant="flat"
              @click="handleNotificationClick(notification)"
              :class="[
                active ? 'bg-gray-50' : '',
                'w-full flex items-center gap-3 px-4 py-3 text-sm text-left border-b border-gray-100 last:border-0',
              ]"
            >
              <span
                :class="[
                  'h-2 w-2 rounded-full shrink-0',
                  notification.read ? 'bg-gray-300' : 'bg-primary-500',
                ]"
              />
              <span
                :class="[
                  'text-gray-900',
                  notification.read ? 'font-normal' : 'font-semibold',
                ]"
              >
                {{ notification.message }}
              </span>
              <span class="text-gray-500 text-xs ml-auto shrink-0">
                {{ notification.date }}
              </span>
            </Button>
          </MenuItem>
        </div>

        <div
          v-if="notifications.length === 0"
          class="px-4 py-8 text-center text-sm text-gray-500"
        >
          No notifications
        </div>

        <div class="px-4 py-2 border-t border-gray-100">
          <Button
            variant="flat"
            text="View all notifications"
            class="w-full text-center text-sm text-gray-600 hover:text-gray-900"
            @click="handleViewAll(close)"
          />
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { BellIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
import Button from "../../components/ui/Button.vue";

export interface Notification {
  id: string | number;
  message: string;
  date: string;
  read: boolean;
}

interface Props {
  notifications: Notification[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: "markAllAsRead"): void;
  (event: "viewAll"): void;
  (event: "notificationClick", notification: Notification): void;
}>();

const unreadCount = computed(
  () => props.notifications.filter((n) => !n.read).length
);

const handleNotificationClick = (notification: Notification) => {
  if (!notification.read) {
    emit("notificationClick", notification);
  }
};

const handleViewAll = (close: () => void) => {
  emit("viewAll");
  close();
};
</script>
