
import Login from "@kenstack/modules/Login";
import { session } from "@/config/server";

export default function page() {
  return (
    <main className="mx-auto max-w-xl">
      <h1 className="text-4xl my-4"> Login </h1>
      <Login session={session} />
    </main>
  );
}
