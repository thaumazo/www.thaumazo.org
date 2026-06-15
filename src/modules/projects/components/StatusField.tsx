"use client";

import Field, { type FieldProps } from "@kenstack/forms/Field";

type StatusFieldProps = FieldProps & {
  options: { value: string; label: string }[];
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
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-50"
            >
              <input
                {...field}
                type="radio"
                value={option.value}
                checked={field.value === option.value}
                onChange={() => {
                  field.onChange(option.value);
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    />
  );
}
