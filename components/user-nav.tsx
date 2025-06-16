"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

// Definisikan tipe yang bersih dan spesifik untuk state user di komponen ini
interface NavUserState {
    email?: string;
    fullName?: string;
}

export function UserNav() {
  const router = useRouter();
  // Gunakan tipe state yang baru dan lebih aman
  const [user, setUser] = useState<NavUserState | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', authUser.id)
                .single();
            
            // Set state dengan struktur data yang bersih dan aman
            setUser({ 
                email: authUser.email,
                fullName: profile?.full_name ?? undefined,
            });
        }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  if (!user) {
      // Tampilkan placeholder atau loading state saat data user belum ada
      return (
        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
      );
  }

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="User Avatar" />
            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.fullName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/pengaturan')}>
            Pengaturan
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
