"use client";
import { useEffect, useState, useRef } from "react";
import { Link } from "@/components/ui/link";
import { useUserInfo } from "@/context/userInfo";

import AccountMenuItems from "./Items";
import LogoutButton from "./LogoutButton";

import {
  NavigationMenu,
  NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  // NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export default function AccountMenu() {
  const ref = useRef();
  const [open, setOpen] = useState("");
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClick = (evt) => {
      if (ref.current.contains(evt.target)) {
        return;
      }
      // console.log(evt.target);
      setOpen("");
      evt.preventDefault();
      evt.stopPropagation();
    };
    document.addEventListener("click", handleClick, true);

    const handleKeyDown = (evt) => {
      if (evt.key === "Escape") {
        setOpen("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const { data, isLoading } = useUserInfo();

  if (isLoading) {
    return;
  }

  if (data?.authenticated) {
    return (
      <NavigationMenu ref={ref} value={open}>
        <NavigationMenuList>
          <NavigationMenuItem value="my-account">
            <NavigationMenuTrigger
              className="cursor-pointer"
              onClick={() => {
                setOpen(open ? "" : "my-account");
              }}
            >
              My Account
            </NavigationMenuTrigger>
            <NavigationMenuContent
              side="left"
              className="min-w-32 px-4"
              onClick={() => {
                setOpen("");
              }}
            >
              <AccountMenuItems />
              <LogoutButton />
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <Link href="/login" className="px-4">
      Login
    </Link>
  );
}
