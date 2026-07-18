"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@kenstack/components/Badge";
import { Button } from "@kenstack/components/Button";
import Field, { type FieldProps } from "@kenstack/forms/Field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@kenstack/forms/controls/Combobox";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

export type SdgOption = { value: string; label: string };

type SdgComboboxFieldProps = FieldProps & {
  options: SdgOption[];
  placeholder?: string;
};

function getSelectedValues(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function SdgComboboxControl({
  field,
  options,
  placeholder,
}: {
  field: ControllerRenderProps<FieldValues, Path<FieldValues>>;
  options: SdgOption[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState("");
  const selectedValues = getSelectedValues(field.value);
  const optionByValue = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options],
  );
  const availableOptions = options.filter(
    (option) => !selectedValues.includes(option.value),
  );

  function addValue(option: SdgOption | null) {
    if (!option || selectedValues.includes(option.value)) {
      return;
    }

    field.onChange([...selectedValues, option.value]);
    setKeywords("");
    setOpen(false);
  }

  function removeValue(value: string) {
    field.onChange(selectedValues.filter((item) => item !== value));
  }

  return (
    <div className="space-y-2">
      <Combobox
        items={availableOptions}
        open={open}
        inputValue={keywords}
        value=""
        autoHighlight
        onInputValueChange={setKeywords}
        onOpenChange={setOpen}
        onValueChange={(_value, option) => {
          addValue(option);
        }}
      >
        <ComboboxInput placeholder={placeholder} showClear className="w-full" />
        <ComboboxContent>
          <ComboboxEmpty>No SDGs found.</ComboboxEmpty>
          <ComboboxList>
            {(option: SdgOption) => (
              <ComboboxItem key={option.value} value={option}>
                <img
                  src={`/images/sdgs/${option.value}.svg`}
                  alt=""
                  className="size-6 shrink-0"
                />
                <span>{option.label}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((value) => {
            const option = optionByValue.get(value);

            if (!option) {
              return null;
            }

            return (
              <Badge
                key={value}
                variant="secondary"
                className="max-w-full gap-2 pr-1 text-sm"
              >
                <img
                  src={`/images/sdgs/${option.value}.svg`}
                  alt=""
                  className="size-5 shrink-0"
                />
                <span className="truncate">{option.label}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-5"
                  aria-label={`Remove ${option.label}`}
                  onClick={() => {
                    removeValue(value);
                  }}
                >
                  <X className="size-3.5" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SdgComboboxField({
  name,
  label,
  description,
  options,
  placeholder = "Select SDGs",
}: SdgComboboxFieldProps) {
  return (
    <Field
      name={name}
      label={label}
      description={description}
      render={({ field }) => (
        <SdgComboboxControl
          field={field}
          options={options}
          placeholder={placeholder}
        />
      )}
    />
  );
}
