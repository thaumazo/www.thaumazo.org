"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import Field, { type FieldProps } from "@kenstack/forms/Field";
import { Button } from "@kenstack/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@kenstack/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@kenstack/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

export type SdgOption = [value: string, label: string];

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
  const selectedValues = getSelectedValues(field.value);
  const optionByValue = useMemo(
    () => new Map(options.map(([value, label]) => [value, { label, value }])),
    [options],
  );
  const availableOptions = options.filter(
    ([value]) => !selectedValues.includes(value),
  );

  function addValue(value: string) {
    if (selectedValues.includes(value)) {
      return;
    }

    field.onChange([...selectedValues, value]);
    setOpen(false);
  }

  function removeValue(value: string) {
    field.onChange(selectedValues.filter((item) => item !== value));
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="text-muted-foreground truncate">
              {placeholder}
            </span>
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput placeholder="Search SDGs..." />
            <CommandList>
              <CommandEmpty>No SDGs found.</CommandEmpty>
              {availableOptions.map(([value, label]) => (
                <CommandItem
                  key={value}
                  value={label}
                  onSelect={() => {
                    addValue(value);
                  }}
                >
                  <Check className="size-4 opacity-0" />
                  <img
                    src={`/images/sdgs/${value}.svg`}
                    alt=""
                    className="size-6 shrink-0"
                  />
                  <span>{label}</span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((value) => {
            const option = optionByValue.get(value);

            if (!option) {
              return null;
            }

            return (
              <span
                key={value}
                className={cn(
                  "inline-flex max-w-full items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-800",
                  "dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100",
                )}
              >
                <img
                  src={`/images/sdgs/${option.value}.svg`}
                  alt=""
                  className="size-5 shrink-0"
                />
                <span className="truncate">{option.label}</span>
                <button
                  type="button"
                  className="rounded p-0.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                  aria-label={`Remove ${option.label}`}
                  onClick={() => {
                    removeValue(value);
                  }}
                >
                  <X className="size-3.5" />
                </button>
              </span>
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
