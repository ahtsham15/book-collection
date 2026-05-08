"use client";

import { Button } from "@/components/ui/button";

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full h-12 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-medium transition-colors ${className}`}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
}
