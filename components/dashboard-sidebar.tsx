// components/dashboard-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Megaphone,
  LogOut,
  BookOpenCheck,
  Presentation,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DashboardSidebarProps {
  userEmail?: string | null;
}

export default function DashboardSidebar({ userEmail }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh(); // Penting untuk memastikan layout melakukan re-evaluasi
  };

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/penelitian", label: "Penelitian", icon: FileText },
    {
      href: "/dashboard/pengabdian",
      label: "Pengabdian Masyarakat",
      icon: Users,
    },
    { href: "/dashboard/publikasi", label: "Publikasi Ilmiah", icon: BookOpenCheck },
    { href: "/dashboard/seminar", label: "Seminar & Workshop", icon: Presentation },
    { href: "/dashboard/laporan", label: "Laporan & Statistik", icon: BarChart3 },
    { href: "/dashboard/pengumuman", label: "Pengumuman", icon: Megaphone },
    { href: "/dashboard/pengaturan", label: "Pengaturan Akun", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background print:hidden">
      <div className="flex flex-col p-4 space-y-2 border-b">
        <div className="text-lg font-semibold tracking-tight px-2">
          LPPM IAIPG
        </div>
        {userEmail && (
          <div className="px-2 py-1 text-xs text-muted-foreground border rounded-md truncate">
            {userEmail}
          </div>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
