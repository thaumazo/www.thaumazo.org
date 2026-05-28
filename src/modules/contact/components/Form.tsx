"use client";

import * as z from "zod";
import Form from "@kenstack/forms/Form";
import { schema } from "../schema";
import Notice from "@kenstack/forms/Notice";

import InputField from "@kenstack/forms/InputField";
import TextareaField from "@kenstack/forms/TextareaField";
import Submit from "@kenstack/forms/Submit";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import RecaptchaTerms from "@kenstack/components/RecaptchaTerms";

type Schema = z.infer<typeof schema>;
const defaultValues = {
  givenName: "",
  familyName: "",
  email: "",
  organization: "",
  message: "",
} satisfies Schema;

export function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  return (
    <Form
      className="max-w-lg space-y-4"
      apiPath="/api/contact"
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={async ({ data, mutation, form }) => {
        const recaptchaToken = executeRecaptcha
          ? await executeRecaptcha("contact")
          : null;
        return mutation.mutateAsync({ ...data, recaptchaToken }).then((res) => {
          if (res.status === "success") {
            form.reset();
          }
        });
      }}
    >
      <Notice />
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
        <InputField name="givenName" label="Given Name" />
        <InputField name="familyName" label="Family Name" />
      </div>
      <InputField name="email" label="Email" type="email" />
      <InputField name="organization" label="Organization" />
      <TextareaField
        name="message"
        label="How can we help you today?"
        rows={5}
      />

      <Submit>Submit</Submit>

      <RecaptchaTerms />
    </Form>
  );
}
