/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactElement } from "react";

interface InputProps {
  id: string;
  title?: string;
  type?: string;
  placeholder?: string;
  icon?: ReactElement<any, any>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function TypeInput({
  id,
  title,
  type,
  placeholder,
  icon,
  value,
  onChange,
  required,
}: InputProps) {
  return (
    <div className="my-5 flex flex-col gap-2">
      <label htmlFor={id} className="text-lg font-bold text-light-3">
        {title}
      </label>
      <div className="relative">
        <div
          id="icon"
          className="absolute left-2 h-full flex items-center jusify-center text-red-3"
        >
          {icon}
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full bg-dark-1 p-2 pl-7 rounded-lg text-red-3"
        />
      </div>
    </div>
  );
}

export default TypeInput;
