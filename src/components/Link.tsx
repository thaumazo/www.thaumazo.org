import * as React from "react";
import type { LinkProps } from "next/link";

import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "@kenstack/components/Button";
import NextLink from "next/link";

function Link({
  className,
  variant = "link",
  size,
  ...props
}: React.ComponentProps<"a"> &
  LinkProps &
  VariantProps<typeof buttonVariants>) {
  return (
    <NextLink
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}

export { buttonVariants };
export default Link;
