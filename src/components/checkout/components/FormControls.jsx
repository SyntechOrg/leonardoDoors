import React from "react";

export function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-emerald-300"
      />
    </label>
  );
}

export function Select({ label, id, value, onChange, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700">{label}</span>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-emerald-300"
      >
        {children}
      </select>
    </label>
  );
}

export function RadioCard({
  name,
  checked,
  onChange,
  title,
  subtitle,
  right,
  className = "",
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 rounded border p-4 ${
        checked
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 bg-white text-gray-900"
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-gray-900"
        />
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {subtitle ? (
            <div className="text-xs opacity-80">{subtitle}</div>
          ) : null}
        </div>
      </div>
      {right ? <div className="text-sm font-semibold">{right}</div> : null}
    </label>
  );
}
