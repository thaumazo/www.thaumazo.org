import admin from "@/modules/admin";
import { adminPipeline } from "@kenstack/admin/api";

export const { GET, POST } = adminPipeline({ adminConfig: admin });
