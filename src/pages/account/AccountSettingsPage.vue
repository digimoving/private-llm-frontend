<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 class="text-xl font-bold mb-4">Account Settings</h2>

      <!-- Profile Information -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">Profile Information</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Name</label
            >
            <Input v-model="form.name" type="text" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <Input v-model="form.email" type="text" class="w-full" disabled />
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-4">Preferences</h3>

        <label class="text-sm font-medium text-gray-700">Dark Mode</label>
        <Toggle
          v-model="themeStore.isDarkMode"
          label="Enable dark mode for the application"
          class="mt-2"
        />
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <Button
          text="Save Changes"
          :loading="loading"
          :disabled="loading"
          @click="onSave"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import Input from "../../components/ui/Input.vue";
import Button from "../../components/ui/Button.vue";
import Toggle from "../../components/ui/Toggle.vue";
import { useThemeStore } from "../../stores/theme";

const loading = ref(false);
const themeStore = useThemeStore();

const form = reactive({
  name: "User Name",
  email: "user@name.com",
});

const onSave = async () => {
  loading.value = true;
  try {
    // TODO: Implement save functionality
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    loading.value = false;
  }
};
</script>
