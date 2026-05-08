import LoginPage from "@/features/auth/loginPage";
import PageLayout from "../../components/common/pageLayout";

export default function Login() {
  return (
    <PageLayout centered>
      <div className="w-full max-w-md space-y-4">
        <LoginPage />
      </div>
    </PageLayout>
  );
}
