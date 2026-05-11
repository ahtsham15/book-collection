import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar";
  import {
    Package,
    Users,
    Tag,
    FileText,
    Settings,
    Ruler,
    Flag, // Changed from FlagIcon to Flag
    BookOpen,
    Building2, // Optional: better icon for publishers
  } from "lucide-react";
  import { useLocation, Link } from "react-router-dom";
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: Package,
      url: "/home",
    },
    {
      title: "Books",
      icon: BookOpen, // Changed from Tag to BookOpen for better representation
      url: "/books",
    },
    {
      title: "Authors",
      icon: Users, // Changed from Ruler to Users for better representation
      url: "/authors",
    },
    {
      title: "Publishers", // Changed from "Publish" to "Publishers" for clarity
      icon: Building2, // Or use Flag if you prefer
      url: "/publishers", // Changed from "/publish" to match the route in App.jsx
    },
    // {
    //   title: "Settings",
    //   icon: Settings,
    //   url: "/settings",
    // },
  ];
  
  export function AppSidebar() {
    const location = useLocation();
  
    return (
      <Sidebar className="border-r border-gray-200 h-screen flex-shrink-0">
        <SidebarHeader className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/book_collection.jpg" alt="Book Collection" className="h-10 w-auto ml-8" />
          </div>
        </SidebarHeader>
        <SidebarContent className="pt-6">
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`
                        flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                        ${
                          isActive
                            ? "text-orange-500 bg-orange-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    );
  }