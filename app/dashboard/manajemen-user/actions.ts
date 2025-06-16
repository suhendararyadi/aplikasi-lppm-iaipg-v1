"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password minimal 8 karakter"),
  full_name: z.string().min(1, "Nama lengkap tidak boleh kosong"),
  identity_number: z.string().optional(),
  role: z.enum(["LPPM", "DPL", "MAHASISWA"]),
  dpl_id: z.string().uuid().optional(),
});

export async function createUser(prevState: any, formData: FormData) {
  const validatedFields = UserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Data tidak valid.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, role, ...profileData } = validatedFields.data;

  const supabaseAdmin = createAdminClient();

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // User harus konfirmasi email
      user_metadata: {
        role: role,
        ...profileData,
      },
    });

  if (authError) {
    return {
      message: authError.message,
    };
  }
  
  // Update tabel profiles secara manual setelah user dibuat
  if (authData.user) {
      const { error: profileError } = await supabaseAdmin.from('profiles').update({
          full_name: profileData.full_name,
          identity_number: profileData.identity_number,
          dpl_id: role === 'MAHASISWA' ? profileData.dpl_id : null
      }).eq('id', authData.user.id);
      
      if(profileError) {
          // Jika gagal update profil, sebaiknya user dihapus agar tidak ada data anomali
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          return { message: `Gagal membuat profil: ${profileError.message}` };
      }
  }


  revalidatePath("/dashboard/manajemen-user");
  return { message: "Pengguna berhasil dibuat." };
}
