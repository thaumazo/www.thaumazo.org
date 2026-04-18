import { pipeline, recaptcha, type PipelineAction } from "@kenstack/lib/api";
import { NextRequest } from "next/server";
import { joinSchema } from "@tenants/modules/join/schema";
import { deps } from "@app/deps";
import { notFound } from "next/navigation";
import omit from "lodash-es/omit";
import bcrypt from "bcrypt";

import welcomeEmail from "@tenants/modules/join/api/welcomeEmail";

export const POST = (request: NextRequest) =>
  pipeline({ request, schema: joinSchema }, [recaptcha(), joinAction]);

const joinAction: PipelineAction<typeof joinSchema> = async ({
  response,
  data,
}) => {
  if (!data) {
    throw Error("data is required");
  }
  const { db, tables } = deps;
  const org = await deps.getCurrentOrganization();
  if (!org) {
    notFound();
  }
  // await db.insert(tables.organizations).values({
  //   name: "Test",
  //   slug: "test",
  // });

  const passwordHash = await bcrypt.hash(data.password, 12);
  const insertValues = {
    ...omit(data, ["password", "confirmPassword"]),
    passwordHash,
  };

  try {
    let userId: number | undefined;

    // const result = await db.insert(tables.users).values(data);
    // await db.insert(tables.organizationMembers).values({
    //   orgId: org.id,
    //   userId: result,
    // });

    await db.transaction(async (tx) => {
      const { users } = tables;
      const [user] = await tx
        .insert(users)
        .values({ ...insertValues, roles: ["admin"] })
        .returning({ id: users.id });

      userId = user.id;
      await tx.insert(tables.organizationMembers).values({
        orgId: org.id,
        userId: user.id,
      });
    });

    if (!userId) {
      return response.error(
        "There was an unexpected problem creating your account. "
      );
    }
    await deps.logger.audit({
      userId,
      action: "join",
      entityId: userId,
      entityType: "users",
    });
    deps.auth.login(userId);
    welcomeEmail(userId);

    return response.success({
      redirect: "/",
    });
  } catch (err) {
    const dbError = deps.dbErrorTranslator(err);
    if (dbError) {
      return response.json(dbError);
    }

    throw err;
  }
};
