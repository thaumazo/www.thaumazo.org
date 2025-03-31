"use client";
import AutoForm from "@kenstack/forms/AutoForm";
import form from "./fields";
const store = form.createStore();

import { useMutation } from "@kenstack/query";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import apiAction from "@kenstack/client/apiAction";

import RecaptchaTerms from "@/components/RecaptchaTerms";
import Submit from "@/components/Submit";

export default function Form() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const mutation = useMutation({
    mutationFn: async ({ values }) => {
      const recaptchaToken = await executeRecaptcha("contact");
      return await apiAction("/contact/api", { ...values, recaptchaToken });
    },
    onSuccess: () => {
      store.getState().reset();
    },
    store,
  });

  return (
    <section className="flex flex-col gap-4 max-w-3xl px-4 mx-auto my-4">
      <AutoForm form={form} store={store} mutation={mutation}>
        <div>
          <Submit>Submit</Submit>
        </div>
      </AutoForm>

      <RecaptchaTerms />
    </section>
  );
}
