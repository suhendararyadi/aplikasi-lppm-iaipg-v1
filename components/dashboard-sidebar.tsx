// components/dashboard-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { 
  Home, 
  Settings, 
  LogOut, 
  FilePlus2, 
  History,
  UserCog,
  FileCheck2,
  BarChart3
} from "lucide-react";

// Definisikan tipe untuk item navigasi
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

// Konfigurasi menu berdasarkan peran pengguna
const navConfig: Record<string, NavItem[]> = {
  LPPM: [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/laporan-penelitian", label: "Laporan Penelitian", icon: BarChart3 },
    { href: "/dashboard/manajemen-user", label: "Manajemen User", icon: UserCog },
    { href: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings },
  ],
  DPL: [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/verifikasi-laporan", label: "Verifikasi Laporan", icon: FileCheck2 },
    { href: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings },
  ],
  MAHASISWA: [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/laporan/buat-baru", label: "Buat Laporan Baru", icon: FilePlus2 },
    { href: "/dashboard/laporan/riwayat", label: "Riwayat Laporan", icon: History },
    { href: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings },
  ],
};


export default function DashboardSidebar({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUserRole(profile.role);
        }
      }
      setIsLoading(false);
    };
    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh(); 
  };
  
  const navItems = userRole ? navConfig[userRole] || [] : [];

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
        {isLoading ? (
          <div className="p-4 space-y-2">
            <div className="h-8 bg-muted rounded-md animate-pulse"></div>
            <div className="h-8 bg-muted rounded-md animate-pulse"></div>
            <div className="h-8 bg-muted rounded-md animate-pulse"></div>
          </div>
        ) : (
          navItems.map((item) => (
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
          ))
        )}
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
