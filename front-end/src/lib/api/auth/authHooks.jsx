// lib/api/auth/authHooks.jsx
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../apiClient";
import { useAuth } from "../../auth/authContext";

export const loginUser = async ({ email, password }) => {
  const response = await apiClient("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  
  if (response.error) {
    throw new Error(response.message || "Login failed");
  }
  
  return response;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data);
      navigate("/home");
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
      alert(error.message || "Login failed. Please check your credentials.");
    },
  });
};