"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUserDialog } from "./edit-user-dialog";
import { DeleteUserAlert } from "./delete-user-alert";
import { type Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type DPLProfile = Pick<Profile, "id" | "full_name">;

interface UserTableActionsProps {
  profile: Profile;
  dplList: DPLProfile[];
  currentUserId: string | undefined;
}

export function UserTableActions({ profile, dplList, currentUserId }: UserTableActionsProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const isSelf = profile.id === currentUserId;

  return (
    <>
      <EditUserDialog 
        profile={profile} 
        dplList={dplList} 
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={() => setEditDialogOpen(true)}
            disabled={isSelf}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onSelect={(e) => e.preventDefault()}
            disabled={isSelf}
          >
            {/* FIX: Menghapus prop 'isDisabled' yang tidak lagi digunakan */}
            <DeleteUserAlert userId={profile.id} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
