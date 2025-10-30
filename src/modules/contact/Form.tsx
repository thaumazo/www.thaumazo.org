"use client";

import * as z from "zod";
import Form from "@kenstack/forms/Form";
import schema from "./schema";
import Notice from "@kenstack/forms/Notice";

import InputField from "@kenstack/forms/InputField";
import TextareaField from "@kenstack/forms/TextareaField";
import Submit from "@kenstack/forms/Submit";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import RecaptchaTerms from "@kenstack/components/RecaptchaTerms";

type Schema = z.infer<typeof schema>;
const defaultValues = {
  first_name: "",
  last_name: "",
  email: "",
  organization: "",
  message: "",
} satisfies Schema;

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  return (
    <Form
      className="max-w-lg space-y-4"
      apiPath="/contact/api"
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={async ({ data, mutation, form }) => {
        const recaptchaToken = await executeRecaptcha("login");
        return mutation.mutateAsync({ ...data, recaptchaToken }).then((res) => {
          if (res.status === "success") {
            form.reset();
          }
        });
      }}
    >
      <Notice />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField name="first_name" label="First Name" />
        <InputField name="last_name" label="Last Name" />
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
