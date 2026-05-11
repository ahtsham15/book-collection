import LoginLayout from "./loginLayout";
import LoginHeader from "./loginHeader";
import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginHeader />
      <LoginForm />
      <div className="text-center"></div>
    </LoginLayout>
  );
}
