import * as React from "react";
import type { LinkProps } from "next/link";

import { cn } from "@kenstack/lib/utils";
import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import NextLink from "next/link";

function Link({
  className,
  variant = "link",
  size,
  ...props
}: React.ComponentProps<"a"> &
  LinkProps &
  VariantProps<typeof buttonVariants>) {
  const classes = cn(buttonVariants({ variant, size, className }));
  return (
    <NextLink
      data-slot="button"
      // className={cn(buttonVariants({ variant, size, className }))}
      className={classes}
      {...props}
    />
  );
}

export { buttonVariants };
export default Link;
