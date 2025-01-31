import ForgottenPassword from "@kenstack/modules/ForgottenPassword";
import { session } from "@/config/server";

export default function page() {
  return (
    <main className="mx-auto max-w-xl">
      <h1 className="text-4xl my-4"> Forgotten password </h1>
      <p className="my-4">
        Enter your email below and a link will be sent to reset your password.
      </p>
      <ForgottenPassword session={session} />
    </main>
  );
}

export const metadata = {
  title: "Forgotten password",
}
