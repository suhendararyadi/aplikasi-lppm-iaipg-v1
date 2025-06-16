"use client";

import React, { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateUser } from "@/app/dashboard/manajemen-user/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type DPLProfile = Pick<Profile, "id" | "full_name">;

const initialState = { message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? "Memperbarui..." : "Simpan Perubahan"}
    </Button>
  );
}

interface EditUserDialogProps {
    profile: Profile;
    dplList: DPLProfile[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export function EditUserDialog({ profile, dplList, open, onOpenChange }: EditUserDialogProps) {
  const [state, formAction] = useActionState(updateUser, initialState);
  const [selectedRole, setSelectedRole] = useState(profile.role);

  useEffect(() => {
    if (state?.message.includes("berhasil")) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Perbarui detail pengguna. Biarkan password kosong jika tidak ingin mengubahnya.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="userId" value={profile.id} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Nama Lengkap
              </Label>
              <Input id="full_name" name="full_name" defaultValue={profile.full_name || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new_password" className="text-right">
                Password Baru
              </Label>
              <Input id="new_password" name="new_password" type="password" className="col-span-3" placeholder="Kosongkan jika tidak berubah"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="identity_number" className="text-right">
                NIP/NIM
              </Label>
              <Input id="identity_number" name="identity_number" defaultValue={profile.identity_number || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select name="role" defaultValue={profile.role} onValueChange={setSelectedRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LPPM">LPPM</SelectItem>
                  <SelectItem value="DPL">DPL</SelectItem>
                  <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedRole === "MAHASISWA" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dpl_id" className="text-right">
                  DPL
                </Label>
                <Select name="dpl_id" defaultValue={profile.dpl_id || ""}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih DPL" />
                  </SelectTrigger>
                  <SelectContent>
                    {dplList.map((dpl) => (
                      <SelectItem key={dpl.id} value={dpl.id}>
                        {dpl.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
             {state?.message && !state.message.includes("berhasil") && (
              <p className="text-sm text-red-500 col-span-4">{state.message}</p>
            )}
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
