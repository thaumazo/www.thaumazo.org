import { session } from "@/config/server";
import Authenticate from "@kenstack/server/Authenticate";
import ResetPassword from "@kenstack/modules/ResetPassword";

export default function page() {
  return (
    <Authenticate session={session} roles={["AUTHENTICATED"]}>
      <main className="mx-auto max-w-xl">
        <h1 className="text-4xl my-4"> Change your password </h1>
        <p className="my-4">
          Type your new password here. Make sure it has at least 8 characters.
          It should have both big and small letters and also a number.
        </p>
        <ResetPassword session={session} />
      </main>
    </Authenticate>
  );
}
