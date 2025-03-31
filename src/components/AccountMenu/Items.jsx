import { Link } from "@/components/ui/link";
import { useUserInfo } from "@/context/userInfo";

const links = [
  ["Profile", "/profile"],
  ["Reset Password", "/reset-password"],
];

export default function AccountMenuItems() {
  const { data } = useUserInfo();
  if (data?.authenticated !== true) {
    return;
  }

  return (
    <>
      {data.roles.includes("ADMIN") && (
        <Link className="w-full justify-start" href="/admin" key="admin">
          Admin
        </Link>
      )}
      {links.map(([text, href], key) => (
        <Link className="w-full justify-start" href={href} key={href + key}>
          {text}
        </Link>
      ))}
    </>
  );
}
