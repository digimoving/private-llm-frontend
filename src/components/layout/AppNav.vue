<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <Button
            variant="icon"
            @click="goToProjects"
            aria-label="Go to Projects"
            class="!hover:bg-transparent !bg-transparent"
          >
            <img
              class="h-8 w-auto"
              src="../../assets/logo.svg"
              alt="Private LLM"
            />
          </Button>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex items-center gap-2">
            <NotificationMenu
              :notifications="notifications"
              :open="notificationMenuOpen"
              @markAllAsRead="handleMarkAllAsRead"
              @viewAll="handleViewAll"
              @notificationClick="handleNotificationClick"
              @update:open="notificationMenuOpen = $event"
            />
            <Menu :items="userMenuItems" />
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="-mr-2 flex sm:hidden">
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
            :aria-expanded="open"
            :aria-controls="'mobile-menu'"
          >
            <span class="sr-only">{{
              open ? "Close main menu" : "Open main menu"
            }}</span>
            <Bars3Icon v-if="!open" class="h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <DisclosurePanel id="mobile-menu" class="sm:hidden">
      <div class="border-t border-gray-700 pt-4 pb-3">
        <!-- Mobile user info -->
        <div class="flex items-center px-5">
          <div class="shrink-0">
            <UserCircleIcon
              class="h-10 w-10 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-white">User Name</div>
            <div class="text-sm font-medium text-gray-400">user@name.com</div>
          </div>
          <!-- Mobile notification button -->
          <Button
            variant="icon"
            :icon="BellIcon"
            class="relative ml-auto text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-offset-2 focus:ring-offset-gray-800"
            @click="handleMobileNotificationClick"
            aria-label="View notifications"
          >
            <span
              v-if="unreadCount > 0"
              class="absolute top-0.75 right-0.75 h-2.5 w-2.5 bg-primary-500 rounded-full"
            />
          </Button>
        </div>

        <!-- Mobile menu items -->
        <div class="mt-3 space-y-1 px-2">
          <Button
            v-for="item in userMenuItems"
            :key="item.label"
            variant="flat"
            :icon="item.icon"
            :text="item.label"
            class="flex w-full items-center rounded-md px-3 py-2 text-base text-white hover:bg-gray-700 hover:text-white"
            @click="item.onClick"
          />
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import Menu from "../ui/Menu.vue";
import NotificationMenu from "../notifications/NotificationsMenu.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  XMarkIcon,
  UserIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import type { Notification } from "../notifications/NotificationsMenu.vue";
import Button from "../ui/Button.vue";
import { useRouter } from "vue-router";

// Example notifications - in real app, this would likely come from a store or props
const notifications = ref<Notification[]>([
  {
    id: 1,
    message: "Your model 'Customer Service Bot' has finished training",
    date: "14/04/2025",
    read: false,
  },
  {
    id: 2,
    message: "Your model 'Product Recommender' has finished training",
    date: "13/04/2025",
    read: true,
  },
]);

const unreadCount = computed(
  () => notifications.value.filter((n: Notification) => !n.read).length
);

const router = useRouter();

// Ref to control notification menu open state
const notificationMenuOpen = ref(false);

const handleMarkAllAsRead = () => {
  notifications.value = notifications.value.map((n: Notification) => ({
    ...n,
    read: true,
  }));
};

const handleNotificationClick = (notification: Notification) => {
  const index = notifications.value.findIndex(
    (n: Notification) => n.id === notification.id
  );
  if (index !== -1) {
    notifications.value[index] = { ...notification, read: true };
  }
};

const handleViewAll = () => {
  router.push({ name: "notifications" });
  notificationMenuOpen.value = false;
};

const handleMobileNotificationClick = () => {
  // Navigate to notifications page on mobile
  handleViewAll();
};

const goToProjects = () => {
  router.push({ name: "projects" });
};

const userMenuItems = [
  {
    label: "Account Settings",
    icon: UserIcon,
    onClick: () => router.push({ name: "account" }),
  },
  {
    label: "Billing",
    icon: CreditCardIcon,
    onClick: () => router.push({ name: "billing" }),
  },

  {
    label: "Help",
    icon: QuestionMarkCircleIcon,
    onClick: () => console.log("Help"),
  },
  {
    label: "Log Out",
    icon: ArrowRightStartOnRectangleIcon,
    onClick: () => console.log("Log Out"),
  },
];
</script>
