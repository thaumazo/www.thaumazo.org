import admin from "@/modules/admin";
import { adminPipeline } from "@kenstack/admin/api";

export const { POST } = adminPipeline({ adminConfig: admin });
