<template>
  <div>
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      <h2 class="text-xl font-bold mb-1">Billing Preferences</h2>
      <p class="text-sm text-gray-600">
        Manage your billing information and notifications.
      </p>
      <Form
        :fields="fields"
        :initial-values="formInitialValues"
        :use-grid="true"
        class="grid grid-cols-1 gap-x-4 gap-b-4"
        title=""
        subtitle=""
        @update="onFormUpdate"
      />
      <div class="flex justify-end mt-4">
        <Button
          :disabled="loading"
          :loading="loading"
          text="Save Changes"
          @click="onSave"
        />
      </div>
      <div v-if="error" class="text-error-600 mt-2">{{ error }}</div>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div class="mb-4">
        <div class="font-semibold mb-1">Email Notifications</div>
        <div class="text-sm text-gray-600 mb-2">
          Receive billing notifications via email
        </div>
        <Toggle
          v-model="form.notificationsEnabled"
          :disabled="loading"
          label="Email Notifications"
          description="Receive billing notifications via email"
        />
      </div>
      <div>
        <div class="font-semibold mb-1">Currency</div>
        <SelectInput
          v-model="form.currency"
          :options="currencyOptions"
          :disabled="loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useBillingStore } from "../../stores/billing";
import Form from "../ui/Form.vue";
import SelectInput from "../ui/SelectInput.vue";
import Toggle from "../ui/Toggle.vue";
import Button from "../ui/Button.vue";

const billingStore = useBillingStore();
const loading = ref(false);
const error = ref("");

const form = reactive({
  name: "",
  email: "",
  company: "",
  taxId: "",
  address: "",
  city: "",
  postcode: "",
  country: "",
  currency: "",
  notificationsEnabled: false,
});

const formInitialValues = {
  name: form.name,
  email: form.email,
  company: form.company,
  taxId: form.taxId,
  address: form.address,
  city: form.city,
  postcode: form.postcode,
  country: form.country,
};

const fields = [
  { name: "name", label: "Name*", type: "text" as const },
  { name: "email", label: "Email*", type: "text" as const },
  { name: "company", label: "Company", type: "text" as const },
  { name: "taxId", label: "Tax ID", type: "text" as const },
  { name: "address", label: "Address", type: "text" as const },
  { name: "postcode", label: "Postcode", type: "text" as const },
  { name: "city", label: "City", type: "text" as const },
  {
    name: "country",
    label: "Country",
    type: "select" as const,
    options: [
      { value: "United Kingdom", label: "United Kingdom" },
      { value: "United States", label: "United States" },
      { value: "Germany", label: "Germany" },
      { value: "France", label: "France" },
      { value: "Spain", label: "Spain" },
      { value: "Italy", label: "Italy" },
      { value: "Other", label: "Other" },
    ],
  },
];

const currencyOptions = [
  { value: "GBP", label: "GBP = Pound Sterling" },
  { value: "USD", label: "USD = US Dollar" },
  { value: "EUR", label: "EUR = Euro" },
];

const loadPreferences = async () => {
  loading.value = true;
  error.value = "";
  try {
    await billingStore.fetchPreferences();
    if (billingStore.preferences) {
      Object.assign(form, billingStore.preferences);
      Object.assign(formInitialValues, {
        name: form.name,
        email: form.email,
        company: form.company,
        taxId: form.taxId,
        address: form.address,
        city: form.city,
        postcode: form.postcode,
        country: form.country,
      });
    }
  } catch (e: any) {
    error.value = e?.message || "Failed to load preferences";
  } finally {
    loading.value = false;
  }
};

onMounted(loadPreferences);

const onFormUpdate = (values: Record<string, string>) => {
  Object.assign(form, values);
};

const onSave = async () => {
  loading.value = true;
  error.value = "";
  try {
    await billingStore.updatePreferences({ ...form });
  } catch (e: any) {
    error.value = e?.message || "Failed to save preferences";
  } finally {
    loading.value = false;
  }
};
</script>
