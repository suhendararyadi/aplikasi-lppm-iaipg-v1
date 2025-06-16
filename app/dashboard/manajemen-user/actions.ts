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

const UpdateUserSchema = UserSchema.omit({ email: true, password: true }).extend({
    userId: z.string().uuid(),
    new_password: z.string().min(8, "Password baru minimal 8 karakter").optional().or(z.literal('')),
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
      email_confirm: true,
      user_metadata: {
        role: role,
        ...profileData,
      },
    });

  if (authError) {
    return { message: authError.message };
  }
  
  if (authData.user) {
      const { error: profileError } = await supabaseAdmin.from('profiles').update({
          full_name: profileData.full_name,
          identity_number: profileData.identity_number,
          dpl_id: role === 'MAHASISWA' ? profileData.dpl_id : null
      }).eq('id', authData.user.id);
      
      if(profileError) {
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          return { message: `Gagal membuat profil: ${profileError.message}` };
      }
  }

  revalidatePath("/dashboard/manajemen-user");
  return { message: "Pengguna berhasil dibuat." };
}

export async function updateUser(prevState: any, formData: FormData) {
    const validatedFields = UpdateUserSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            message: "Data tidak valid untuk pembaruan.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { userId, new_password, role, ...profileData } = validatedFields.data;
    const supabaseAdmin = createAdminClient();

    // Update profil di tabel 'profiles'
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
            full_name: profileData.full_name,
            identity_number: profileData.identity_number,
            role: role,
            dpl_id: role === 'MAHASISWA' ? profileData.dpl_id : null,
        })
        .eq('id', userId);

    if (profileError) {
        return { message: `Gagal memperbarui profil: ${profileError.message}` };
    }

    // Jika ada password baru, update password user
    if (new_password) {
        const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
            userId, { password: new_password }
        );
        if (passwordError) {
            return { message: `Gagal memperbarui password: ${passwordError.message}` };
        }
    }

    revalidatePath("/dashboard/manajemen-user");
    return { message: "Pengguna berhasil diperbarui." };
}

export async function deleteUser(userId: string) {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
        return { message: `Gagal menghapus pengguna: ${error.message}` };
    }
    
    revalidatePath("/dashboard/manajemen-user");
    return { message: "Pengguna berhasil dihapus." };
}
