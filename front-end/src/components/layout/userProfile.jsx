import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/authContext";

export function UserProfile() {
  const { logout, user: authUser } = useAuth();
  const navigate = useNavigate();

  const user = authUser || {
    name: "Admin",
    email: "admin@adorama.com",
    avatar: "/placeholder.svg?height=32&width=32",
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 focus:outline-none focus:ring-0">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
          />
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "U"}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white rounded-md shadow-lg border border-gray-200"
      >
        <DropdownMenuItem
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
          onClick={handleSettingsClick}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}