"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "@kenstack/forms/context";
import ProgressIcon from "@kenstack/icons/Progress";

export default function SubmitButton(props) {
  const pending = useForm((state) => state.pending);
  return (
    <Button
      className={"relative" + (pending ? " cursor-default" : "")}
      type={pending ? "button" : "submit"}
    >
      {pending && <ProgressIcon className="absolute animate-spin" />}
      <span className={pending ? "opacity-0" : ""}>Submit</span>
    </Button>
  );
}
