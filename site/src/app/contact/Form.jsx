"use client";
import AutoForm from "@kenstack/forms/AutoForm";
import form from "./fields";
const store = form.createStore();
import formAction from "./formAction";

const action = async (...args) => {
  const data = await formAction(...args);
  if (data.success) {
    store.getState().reset();
  }
  return data;
}

export default function Form() {
  return (
    <AutoForm
      // title="Contact us"
      form={form}
      store={store}
      action={action}
      submit={{
        className: "btn btn-primary",
      }}
    />
  );
}
