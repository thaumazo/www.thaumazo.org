import Server from "@kenstack/modules/Library/Server";
import session from "@/session";

export default function AdminPage(props) {
  return <Server {...props} session={session} />;
}
