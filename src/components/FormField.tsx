"use client";

import clsx from "clsx";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  name: string;
  error?: string;
};

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "name"> & {
    as?: "input";
  };

type TextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> & {
    as: "textarea";
  };

type Props = InputProps | TextareaProps;

const fieldClass =
  "w-full bg-transparent border-b border-black/30 focus:border-black outline-none py-3 font-mono text-sm tracking-wide placeholder:text-black/30 transition-colors";

export function FormField(props: Props) {
  const { label, name, error } = props;

  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/70">
        {label}
      </span>
      {props.as === "textarea" ? (
        <textarea
          {...(props as TextareaProps)}
          name={name}
          className={clsx(fieldClass, "resize-none min-h-[7rem]")}
        />
      ) : (
        <input
          {...(props as InputProps)}
          name={name}
          className={fieldClass}
        />
      )}
      {error && (
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}
