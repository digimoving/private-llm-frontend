import { defineStore } from "pinia";
import { billingApi, accountApi } from "../api/api";

interface BillingCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

interface BillingPreferences {
  name: string;
  email: string;
  company: string;
  taxId: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  currency: string;
  notificationsEnabled: boolean;
}

interface BillingLimits {
  currentUsage: number;
  lowerThreshold: number;
  upperThreshold: number;
}

interface CreditSource {
  amount: number;
  source: string;
  status: string;
  expires: string;
}

interface Invoice {
  invoiceName: string;
  created: string;
  cost: number;
  status: string;
}

export const useAccountStore = defineStore("account", {
  state: () => ({
    preferences: {
      darkMode: false,
    },
    billing: {
      balance: 0,
      autoRechargeEnabled: false,
      loading: false,
      cards: [] as BillingCard[],
      preferences: null as BillingPreferences | null,
      limits: null as BillingLimits | null,
      credit: {
        totalCredit: 0,
        sources: [] as CreditSource[],
      },
      history: [] as Invoice[],
    },
  }),
  actions: {
    async fetchBilling() {
      this.billing.loading = true;
      const data = await billingApi.get();
      this.billing.balance = data.balance;
      this.billing.autoRechargeEnabled = data.autoRechargeEnabled;
      this.billing.cards = data.cards || [];
      this.billing.loading = false;
    },

    async setAutoRecharge(enabled: boolean) {
      this.billing.loading = true;
      await billingApi.updateAutoRecharge(enabled);
      this.billing.autoRechargeEnabled = enabled;
      this.billing.loading = false;
    },

    async addBalance(data: { amount: number; paymentMethodId: string }) {
      this.billing.loading = true;
      await billingApi.addBalance(data);
      await this.fetchBilling();
      this.billing.loading = false;
    },

    async fetchCredit() {
      this.billing.loading = true;
      const data = await billingApi.getCredit();
      this.billing.credit = data;
      this.billing.loading = false;
    },

    async redeemCredit(amount: number) {
      this.billing.loading = true;
      await billingApi.redeemCredit(amount);
      await this.fetchCredit();
      this.billing.loading = false;
    },

    async addPaymentMethod(data: {
      cardNumber: string;
      expiryMonth: number;
      expiryYear: number;
    }) {
      this.billing.loading = true;
      await billingApi.addPaymentMethod(data);
      await this.fetchBilling();
      this.billing.loading = false;
    },

    async deletePaymentMethod(methodId: string) {
      this.billing.loading = true;
      await billingApi.deletePaymentMethod(methodId);
      await this.fetchBilling();
      this.billing.loading = false;
    },

    async setDefaultPaymentMethod(methodId: string) {
      this.billing.loading = true;
      await billingApi.setDefaultPaymentMethod(methodId);
      await this.fetchBilling();
      this.billing.loading = false;
    },

    async fetchHistory() {
      this.billing.loading = true;
      const data = await billingApi.getHistory();
      this.billing.history = data;
      this.billing.loading = false;
    },

    async downloadInvoice(invoiceId: string) {
      return await billingApi.downloadInvoice(invoiceId);
    },

    async fetchPreferences() {
      this.billing.loading = true;
      const data = await billingApi.getPreferences();
      this.billing.preferences = data;
      this.billing.loading = false;
    },

    async updatePreferences(preferences: Partial<BillingPreferences>) {
      this.billing.loading = true;
      await billingApi.updatePreferences(preferences);
      await this.fetchPreferences();
      this.billing.loading = false;
    },

    async updateAutoRechargeSettings(data: {
      rechargeAmount: number;
      triggerAmount: number;
      paymentMethodId: string;
    }) {
      this.billing.loading = true;
      await billingApi.updateAutoRechargeSettings(data);
      await this.fetchBilling();
      this.billing.loading = false;
    },

    async disableAutoRecharge() {
      this.billing.loading = true;
      await billingApi.disableAutoRecharge();
      await this.fetchBilling();
      this.billing.loading = false;
    },

    async fetchLimits() {
      this.billing.loading = true;
      const data = await billingApi.getLimits();
      this.billing.limits = data;
      this.billing.loading = false;
    },

    async updateLimits(data: {
      lowerThreshold: number;
      upperThreshold: number;
    }) {
      this.billing.loading = true;
      await billingApi.updateLimits(data);
      await this.fetchLimits();
      this.billing.loading = false;
    },

    async requestLimitIncrease(data: {
      requestedLimit: number;
      reason: string;
    }) {
      this.billing.loading = true;
      await billingApi.requestLimitIncrease(data);
      this.billing.loading = false;
    },

    // Account actions
    async updateAccountPreferences(preferences: { darkMode?: boolean }) {
      await accountApi.updatePreferences(preferences);
      this.preferences = { ...this.preferences, ...preferences };
    },

    async updatePassword(currentPassword: string, newPassword: string) {
      await accountApi.updatePassword(currentPassword, newPassword);
    },

    async updateEmail(newEmail: string) {
      await accountApi.updateEmail(newEmail);
    },

    async deleteAccount(confirmEmail: string) {
      await accountApi.delete(confirmEmail);
    },
  },
});
