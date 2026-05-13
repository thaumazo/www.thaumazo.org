import { authPipeline } from "@kenstack/auth/api";

export const { POST } = authPipeline({
  forgotPassword: { from: "Thaumazo Unmonitored <unmonitored@thaumazo.org>" },
});
