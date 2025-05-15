export const accountData = {
  billing: {
    balance: 10.97,
    cards: [
      {
        id: "card_1",
        brand: "visa",
        last4: "3027",
        expMonth: "12",
        expYear: "27",
        isDefault: true,
      },
      {
        id: "card_2",
        brand: "mastercard",
        last4: "1122",
        expMonth: "09",
        expYear: "25",
        isDefault: false,
      },
    ],
    autoRechargeEnabled: false,
    autoRechargeSettings: {
      rechargeAmount: 0,
      triggerAmount: 0,
      paymentMethodId: "",
    },
    // Add other billing details as needed
  },
};
