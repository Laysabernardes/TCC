/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import type { ReactElement } from "react";

interface InputProps {
  id: string;
  name: string;
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
  name,
  title,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  required,
}: InputProps) {
  return (
    <div className="my-5 flex flex-col gap-2">
      <label htmlFor={id} className="text-lg font-bold text-light-3">
        {title} {required && <span className="text-red-3">*</span>}
      </label>
      <div className="relative">
        <div
          id="icon"
          className="absolute left-2 h-full flex items-center justify-center text-red-3"
        >
          {icon}
        </div>
        <input
          id={id}
          name={name}
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

interface TextAreaProps {
  id: string;
  name: string;
  title?: string;
  placeholder?: string;
  icon?: ReactElement<any, any>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

function Textarea({
  id,
  name,
  title,
  placeholder,
  icon,
  value,
  onChange,
  required,
}: TextAreaProps) {
  return (
    <div className="my-5 flex flex-col gap-2">
      <label htmlFor={id} className="text-lg font-bold text-light-3">
        {title} {required && <span className="text-red-3">*</span>}
      </label>
      <div className="relative">
        <div
          id="icon"
          className="absolute left-2 bottom-8.5 h-full flex items-center justify-center text-red-3"
        >
          {icon}
        </div>
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full h-25 max-h-25 bg-dark-1 p-2 pl-7 rounded-lg text-red-3 resize-none"
        />
      </div>
    </div>
  );
}

interface SelectionProps {
  id: string;
  name: string;
  title?: string;
  placeholder?: string;
  icon?: ReactElement<any, any>;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

function Selection({
  id,
  name,
  title,
  placeholder,
  icon,
  options,
  onChange,
  required,
}: SelectionProps) {
  return (
    <div className="my-5 flex flex-col gap-2">
      <label htmlFor={id} className="text-lg font-bold text-light-3">
        {title} {required && <span className="text-red-3">*</span>}
      </label>
      <div className="relative">
        <div
          id="icon"
          className="absolute left-2 h-full flex items-center justify-center text-red-3"
        >
          {icon}
        </div>
        <select
          id={id}
          name={name}
          required={required}
          onChange={onChange}
          className="w-full bg-dark-1 p-2 pl-7 rounded-lg text-red-3"
        >
          <option disabled selected>
            {placeholder}
          </option>
          {options.map((o, idx) => (
            <option key={idx} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

import { FaArrowDown } from "react-icons/fa6";

interface OptionItem {
  id: string | number;
  text: string;
}

interface MultiSelectionProps {
  name: string;
  id: string;
  title?: string;
  placeholder?: string;
  icon?: ReactElement;
  options: OptionItem[];
  onChange: (e: { target: { name: string; value: string[] } }) => void;
  required?: boolean;
}

export default function MultiSelect({
  name,
  id,
  title,
  placeholder,
  icon,
  options,
  onChange,
  required,
}: MultiSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<OptionItem[]>([]);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (item: OptionItem) => {
    const exists = selected.some((s) => s.id === item.id);
    const newSelected = exists
      ? selected.filter((s) => s.id !== item.id)
      : [...selected, item];

    setSelected(newSelected);
    onChange({ target: { name, value: newSelected.map((i) => i.text) } });
  };

  const removeItem = (id: string | number) => {
    const newSelected = selected.filter((s) => s.id !== id);
    setSelected(newSelected);
    onChange({ target: { name, value: newSelected.map((i) => i.text) } });
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !(dropdownRef.current as any).contains(e.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {title && (
        <label htmlFor={id} className="text-lg font-bold text-light-3">
          {title} {required && <span className="text-red-3">*</span>}
        </label>
      )}

      <div
        onClick={toggleDropdown}
        className="w-full min-h-[44px] bg-dark-1 p-2 rounded-lg text-red-3 flex flex-wrap items-center cursor-pointer gap-2"
      >
        {icon && <span className="text-red-3 mr-2">{icon}</span>}

        {selected.length === 0 && (
          <span className="text-red-3 opacity-50 absolute ml-5">
            {placeholder}
          </span>
        )}

        {selected.map((item) => (
          <span
            key={item.id}
            className="bg-gray-300 text-dark-2 px-3 py-1 rounded-full flex items-center ml-2"
          >
            {item.text}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
              className="ml-2 text-gray-600 hover:text-black cursor-pointer"
            >
              x
            </button>
          </span>
        ))}

        <FaArrowDown className="ml-auto text-gray-500" />
      </div>

      {isOpen && (
        <div className="mt-1 rounded-lg bg-dark-1 max-h-60 overflow-y-auto absolute z-10 w-full">
          {options.map((item) => (
            <label
              key={item.id}
              className="flex items-center px-4 py-2 text-red-3 hover:bg-dark-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.some((s) => s.id === item.id)}
                onChange={() => handleSelect(item)}
                className="form-checkbox"
              />
              <span className="ml-2">{item.text}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export { TypeInput, Textarea, Selection, MultiSelect };
