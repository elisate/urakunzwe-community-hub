import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Target,
  Users,
  Newspaper,
  Mail,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  DollarSign,
  Settings,
  Award,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/dashboard/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutGrid },
  { name: "Program", path: "/admin/program", icon: Target },
  { name: "Key Achievements", path: "/admin/key-achievements", icon: Award },
  { name: "Impact", path: "/admin/impact", icon: Heart },
  { name: "Team", path: "/admin/team", icon: Users },
  { name: "Donations", path: "/admin/donations", icon: DollarSign },
  { name: "Success Stories", path: "/admin/success-stories", icon: Heart },
  { name: "News", path: "/admin/news", icon: Newspaper },
  { name: "Contact", path: "/admin/contact", icon: Mail },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
          // Mobile styles
          "lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Width based on collapsed state
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                <Heart className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground tracking-tight text-lg leading-none">Urakunzwe</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Community Hub</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
          )}

          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => onClose()}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer (User Profile or other items can go here) */}
        <div className="border-t border-sidebar-border p-3">
          {/* Optional Footer Content */}
        </div>
      </aside>
    </>
  );
}