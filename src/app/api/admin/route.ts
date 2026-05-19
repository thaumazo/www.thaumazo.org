import admin from "@/modules/admin";
import { adminPipeline } from "@kenstack/admin/api";

export const POST = async (request, context) =>
  adminPipeline(request, context, { admin });
