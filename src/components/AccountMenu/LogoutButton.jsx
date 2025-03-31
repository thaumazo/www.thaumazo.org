"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/context/userInfo";

export default function LogoutButton() {
  const router = useRouter();
  const { data, refetch } = useUserInfo();
  if (data?.authenticated !== true) {
    return;
  }
  return (
    <Button
      className="w-full justify-start"
      variant="link"
      onClick={() => {
        fetch("/api/logout", {
          method: "GET",
          cache: "no-store",
        }).then((res) => {
          refetch();
          router.push("/");
        });
      }}
    >
      Logout
    </Button>
  );
}
