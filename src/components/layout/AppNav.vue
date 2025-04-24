<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <div class="shrink-0">
            <img
              class="h-8 w-auto"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex items-center gap-2">
            <NotificationButton />
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
          <NotificationButton additional-class="ml-auto" />
        </div>

        <!-- Mobile menu items -->
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton
            v-for="item in userMenuItems"
            :key="item.label"
            as="button"
            class="flex w-full items-center rounded-md px-3 py-2 text-base text-gray-400 hover:bg-gray-700 hover:text-white"
            @click="item.onClick"
          >
            <component
              :is="item.icon"
              class="mr-3 h-5 w-5"
              aria-hidden="true"
            />
            <span class="text-white">{{ item.label }}</span>
          </DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import Menu from "../ui/Menu.vue";
import NotificationButton from "../ui/NotificationButton.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
  UserIcon,
  CreditCardIcon,
  MoonIcon,
  SunIcon,
  QuestionMarkCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const userMenuItems = [
  {
    label: "Account Settings",
    icon: UserIcon,
    onClick: () => console.log("Account Settings"),
  },
  {
    label: "Billing",
    icon: CreditCardIcon,
    onClick: () => console.log("Billing"),
  },
  {
    label: "Dark Mode",
    icon: MoonIcon,
    onClick: () => console.log("Dark Mode"),
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
