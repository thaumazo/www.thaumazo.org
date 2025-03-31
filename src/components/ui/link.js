import * as React from "react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button";
import NextLink from "next/link";

function Link({ className, variant = "link", size, active = false, ...props }) {
  let classes = cn(buttonVariants({ variant, size, className }));
  if (active) {
    classes = classes.replace("hover:", "");
  }
  return (
    <NextLink
      data-slot="button"
      // className={cn(buttonVariants({ variant, size, className }))}
      className={classes}
      {...props}
    />
  );
}

export { Link, buttonVariants };
