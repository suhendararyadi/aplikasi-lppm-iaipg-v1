"use client";

import { deleteUser } from "@/app/dashboard/manajemen-user/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteUserAlert({ userId, isDisabled }: { userId: string, isDisabled: boolean }) {
  
  const deleteUserWithId = async () => {
      const result = await deleteUser(userId);
      if(result?.message && !result.message.includes("berhasil")){
          alert(result.message); // Gunakan UI yang lebih baik di produksi
      }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="w-full text-left" role="button">Hapus</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pengguna secara permanen dari database otentikasi dan profil mereka.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={deleteUserWithId}>
              <AlertDialogAction type="submit">Hapus</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
