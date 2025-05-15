import { defineStore } from "pinia";
import { billingApi } from "../api/api";

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

interface LoadingState {
  page: boolean;
  balance: boolean;
  credit: boolean;
  paymentMethod: boolean;
  autoRecharge: boolean;
  history: boolean;
  preferences: boolean;
  limits: boolean;
}

export const useBillingStore = defineStore("billing", {
  state: () => ({
    balance: 0,
    autoRechargeEnabled: false,
    loading: {
      page: false,
      balance: false,
      credit: false,
      paymentMethod: false,
      autoRecharge: false,
      history: false,
      preferences: false,
      limits: false,
    } as LoadingState,
    cards: [] as BillingCard[],
    preferences: null as BillingPreferences | null,
    limits: null as BillingLimits | null,
    credit: {
      totalCredit: 0,
      sources: [] as CreditSource[],
    },
    history: [
      {
        invoiceName: "OC9EC763-0016",
        created: "2025-01-09T10:54:00Z",
        cost: 46.3,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0015",
        created: "2024-12-01T05:09:00Z",
        cost: 12.0,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0014",
        created: "2024-10-07T19:04:00Z",
        cost: 14.2,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0013",
        created: "2024-08-29T21:01:00Z",
        cost: 2.1,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0012",
        created: "2024-06-20T02:13:00Z",
        cost: 30.0,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0011",
        created: "2024-06-19T02:01:00Z",
        cost: 0.0,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0010",
        created: "2024-05-15T14:22:00Z",
        cost: 18.5,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0009",
        created: "2024-04-10T09:30:00Z",
        cost: 22.0,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0008",
        created: "2024-03-05T16:45:00Z",
        cost: 8.75,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0007",
        created: "2024-02-01T11:20:00Z",
        cost: 15.0,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0006",
        created: "2024-01-10T08:10:00Z",
        cost: 27.3,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0005",
        created: "2023-12-15T13:55:00Z",
        cost: 19.99,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0004",
        created: "2023-11-20T17:40:00Z",
        cost: 5.5,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0003",
        created: "2023-10-25T20:25:00Z",
        cost: 11.0,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0002",
        created: "2023-09-30T15:15:00Z",
        cost: 7.25,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0001",
        created: "2023-08-05T18:00:00Z",
        cost: 13.5,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0000",
        created: "2023-07-01T12:30:00Z",
        cost: 9.99,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0099",
        created: "2023-06-15T10:10:00Z",
        cost: 21.0,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0098",
        created: "2023-05-20T14:45:00Z",
        cost: 16.8,
        status: "paid",
      },
      {
        invoiceName: "OC9EC763-0097",
        created: "2023-04-25T09:05:00Z",
        cost: 24.0,
        status: "paid",
      },
    ] as Invoice[],
    autoRechargeSettings: null as any | null,
    error: null as string | null,
  }),

  getters: {
    isLoading: (state): boolean => {
      return Object.values(state.loading).some(
        (value: boolean) => value === true
      );
    },
  },

  actions: {
    async fetchBilling() {
      this.loading.page = true;
      this.error = null;
      try {
        const data = await billingApi.get();
        this.balance = data.balance;
        this.autoRechargeEnabled = data.autoRechargeEnabled;
        this.cards = data.cards || [];
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to fetch billing:", error);
        throw error;
      } finally {
        this.loading.page = false;
      }
    },

    async setAutoRecharge(enabled: boolean) {
      this.loading.autoRecharge = true;
      this.error = null;
      try {
        await billingApi.updateAutoRecharge(enabled);
        this.autoRechargeEnabled = enabled;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to set auto-recharge:", error);
        throw error;
      } finally {
        this.loading.autoRecharge = false;
      }
    },

    async addBalance(data: { amount: number; paymentMethodId: string }) {
      this.loading.balance = true;
      this.error = null;
      try {
        await billingApi.addBalance(data);
        this.balance += data.amount;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to add balance:", error);
        throw error;
      } finally {
        this.loading.balance = false;
      }
    },

    async fetchCredit() {
      this.loading.credit = true;
      this.error = null;
      try {
        const data = await billingApi.getCredit();
        this.credit = data;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to fetch credit:", error);
        throw error;
      } finally {
        this.loading.credit = false;
      }
    },

    async redeemCredit(amount: number) {
      this.loading.credit = true;
      this.error = null;
      try {
        await billingApi.redeemCredit(amount);
        this.credit.totalCredit -= amount;
        this.balance += amount;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to redeem credit:", error);
        throw error;
      } finally {
        this.loading.credit = false;
      }
    },

    async addPaymentMethod(data: {
      cardNumber: string;
      expiryMonth: number;
      expiryYear: number;
    }) {
      this.loading.paymentMethod = true;
      this.error = null;
      try {
        const response = await billingApi.addPaymentMethod(data);
        if (response.card) {
          this.cards.push(response.card);
          return { card: response.card };
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to add payment method:", error);
        throw error;
      } finally {
        this.loading.paymentMethod = false;
      }
    },

    async deletePaymentMethod(methodId: string) {
      this.loading.paymentMethod = true;
      this.error = null;
      try {
        await billingApi.deletePaymentMethod(methodId);
        this.cards = this.cards.filter((card) => card.id !== methodId);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to delete payment method:", error);
        throw error;
      } finally {
        this.loading.paymentMethod = false;
      }
    },

    async setDefaultPaymentMethod(methodId: string) {
      this.loading.paymentMethod = true;
      this.error = null;
      try {
        await billingApi.setDefaultPaymentMethod(methodId);
        this.cards = this.cards.map((card) => ({
          ...card,
          isDefault: card.id === methodId,
        }));
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to set default payment method:", error);
        throw error;
      } finally {
        this.loading.paymentMethod = false;
      }
    },

    async fetchHistory() {
      this.loading.history = true;
      this.error = null;
      try {
        const data = await billingApi.getHistory();
        this.history = data;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to fetch history:", error);
        throw error;
      } finally {
        this.loading.history = false;
      }
    },

    async downloadInvoice(invoiceId: string) {
      this.error = null;
      try {
        const blob = await billingApi.downloadInvoice(invoiceId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to download invoice:", error);
        throw error;
      }
    },

    async fetchPreferences() {
      this.loading.preferences = true;
      this.error = null;
      try {
        const data = await billingApi.getPreferences();
        this.preferences = data;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to fetch preferences:", error);
        throw error;
      } finally {
        this.loading.preferences = false;
      }
    },

    async updatePreferences(preferences: Partial<BillingPreferences>) {
      this.loading.preferences = true;
      this.error = null;
      try {
        await billingApi.updatePreferences(preferences);
        if (this.preferences) {
          this.preferences = { ...this.preferences, ...preferences };
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to update preferences:", error);
        throw error;
      } finally {
        this.loading.preferences = false;
      }
    },

    async updateAutoRechargeSettings(data: {
      rechargeAmount: number;
      triggerAmount: number;
      paymentMethodId: string;
    }) {
      this.loading.autoRecharge = true;
      this.error = null;
      try {
        const response = await billingApi.updateAutoRechargeSettings(data);
        if (response && response.success) {
          this.autoRechargeEnabled = response.autoRechargeEnabled;
          this.autoRechargeSettings = response.autoRechargeSettings;
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to update auto-recharge settings:", error);
        throw error;
      } finally {
        this.loading.autoRecharge = false;
      }
    },

    async disableAutoRecharge() {
      this.loading.autoRecharge = true;
      this.error = null;
      try {
        const response = await billingApi.disableAutoRecharge();
        if (response && response.success) {
          this.autoRechargeEnabled = response.autoRechargeEnabled;
          this.autoRechargeSettings = response.autoRechargeSettings;
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to disable auto-recharge:", error);
        throw error;
      } finally {
        this.loading.autoRecharge = false;
      }
    },

    async fetchLimits() {
      this.loading.limits = true;
      this.error = null;
      try {
        const data = await billingApi.getLimits();
        this.limits = data;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to fetch limits:", error);
        throw error;
      } finally {
        this.loading.limits = false;
      }
    },

    async updateLimits(data: {
      lowerThreshold: number;
      upperThreshold: number;
    }) {
      this.loading.limits = true;
      this.error = null;
      try {
        const response = await billingApi.updateLimits(data);
        if (response && response.success && "limits" in response) {
          this.limits = response.limits as {
            currentUsage: number;
            lowerThreshold: number;
            upperThreshold: number;
          };
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to update limits:", error);
        throw error;
      } finally {
        this.loading.limits = false;
      }
    },

    async requestLimitIncrease(data: {
      requestedLimit: number;
      reason: string;
    }) {
      this.loading.limits = true;
      this.error = null;
      try {
        await billingApi.requestLimitIncrease(data);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to request limit increase:", error);
        throw error;
      } finally {
        this.loading.limits = false;
      }
    },
  },
});
