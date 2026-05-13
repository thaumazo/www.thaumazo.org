"use client";

import Field, { type FieldProps } from "@kenstack/forms/Field";

type StatusFieldProps = FieldProps & {
  options: [string, string][];
};

export default function StatusField({
  name,
  label,
  description,
  options,
}: StatusFieldProps) {
  return (
    <Field
      name={name}
      label={label}
      description={description}
      render={({ field }) => (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" tabIndex={-1}>
          {options.map(([key, text]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-50"
            >
              <input
                {...field}
                type="radio"
                value={key}
                checked={field.value === key}
                onChange={() => {
                  field.onChange(key);
                }}
              />
              <span>{text}</span>
            </label>
          ))}
        </div>
      )}
    />
  );
}
