import React from "react";

interface InputProps {
  icon?: React.ReactNode;
  placeholder: string;
  value?: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  label?: string;
  type: string;
  id: string;
  className?: string;
  textBox?: boolean;
  accept?: string;
}

function Input({
  icon,
  placeholder,
  value,
  onChange,
  label,
  type,
  id,
  className,
  textBox,
  accept
}: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {textBox ? (
          <textarea
            id={id}
            name={id}
            placeholder={placeholder}
            value={value}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black h-20 ${className}`}
            required
            onChange={onChange}
          ></textarea>
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full ${
              icon ? "pl-10" : "pl-3"
            } pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black ${className}`}
            required
            accept={accept}
          />
        )}
      </div>
    </div>
  );
}

export default Input;
