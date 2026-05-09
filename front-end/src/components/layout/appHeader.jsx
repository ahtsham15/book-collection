import { UserProfile } from "./userProfile";

export function AppHeader({ title = "Dashboard" }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
        </div>
        <UserProfile />
      </div>
    </header>
  );
}
