import DodoPayments from "dodopayments";

export const dodopayments = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY_TEST || process.env.DODO_PAYMENTS_API_KEY,
  environment: "test_mode",
});
