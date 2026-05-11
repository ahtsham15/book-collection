"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import InputField from "../../components/common/inputField";
import PrimaryButton from "../../components/common/primaryButton";
import { useLogin } from "@/lib/api/auth/authHooks";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
            icon={Mail}
            required
          />

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 mt-[5px]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-12 w-full rounded-md border focus:border-[#FF8C00] focus:ring-[#FF8C00] border-gray-300 bg-background pl-10 pr-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C00] focus-visible:ring-offset-2"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 mt-[4px]" />
                ) : (
                  <Eye className="h-4 w-4 mt-[4px]" />
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error.message || "Login failed. Please try again."}
            </div>
          )}
          
          <PrimaryButton type="submit" loading={isPending}>
            Sign In
          </PrimaryButton>
        </form>
      </CardContent>
    </Card>
  );
}


