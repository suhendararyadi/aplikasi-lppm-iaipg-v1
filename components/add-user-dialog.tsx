"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createUser } from "@/app/dashboard/manajemen-user/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? "Menyimpan..." : "Simpan"}
    </Button>
  );
}

export function AddUserDialog({ dplList }: { dplList: DPLProfile[] }) {
  // FIX: Menggunakan useActionState dari React
  const [state, formAction] = useActionState(createUser, initialState);
  const [selectedRole, setSelectedRole] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.message.includes("berhasil")) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          <DialogDescription>
            Isi detail pengguna dan tetapkan perannya di sistem.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Nama Lengkap
              </Label>
              <Input id="full_name" name="full_name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" name="email" type="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input id="password" name="password" type="password" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="identity_number" className="text-right">
                NIP/NIM
              </Label>
              <Input id="identity_number" name="identity_number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select name="role" onValueChange={setSelectedRole}>
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
                <Select name="dpl_id">
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
