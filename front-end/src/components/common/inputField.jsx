"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  className = "",
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-4 w-4 mt-[4px] text-gray-400" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${
            Icon ? "pl-10" : ""
          } h-12 border-gray-300 border focus:border-[#FF8C00] focus:ring-[#FF8C00] ${className} focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-2`}
          required={required}
        />
      </div>
    </div>
  );
}
