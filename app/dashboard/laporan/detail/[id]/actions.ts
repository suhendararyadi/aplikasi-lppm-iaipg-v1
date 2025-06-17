"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const VerifikasiSchema = z.object({
  laporanId: z.string().min(1),
  feedback: z.string().optional(),
  action: z.enum(["setujui", "revisi"]),
});

export async function processDplAction(prevState: any, formData: FormData) {
  const validatedFields = VerifikasiSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { message: "Data tidak valid." };
  }

  const { laporanId, feedback, action } = validatedFields.data;

  if (action === "revisi" && (!feedback || feedback.trim() === "")) {
    return { message: "Feedback wajib diisi untuk meminta revisi." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Otentikasi gagal." };
  }
  
  // Ambil peran pengguna saat ini
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return { message: "Profil pengguna tidak ditemukan." };
  }

  const newStatus = action === "setujui" ? "Disetujui" : "Revisi";
  
  // Buat query dasar
  let query = supabase
    .from("laporan")
    .update({
      status: newStatus,
      feedback_dpl: feedback,
    })
    .eq("id", Number(laporanId));

  // Tambahkan filter keamanan berdasarkan peran
  if (profile.role === 'DPL') {
    // Jika DPL, pastikan dia hanya bisa update laporan dari mahasiswanya
    query = query.eq("dpl_id", user.id);
  } else if (profile.role !== 'LPPM') {
    // Jika bukan DPL atau LPPM, tolak aksi
    return { message: "Anda tidak memiliki izin untuk melakukan aksi ini." };
  }
  // Jika LPPM, tidak perlu filter tambahan, RLS sudah mengizinkan

  const { error } = await query;

  if (error) {
    return { message: `Gagal memperbarui laporan: ${error.message}` };
  }

  revalidatePath(`/dashboard/laporan/detail/${laporanId}`);
  // LPPM mungkin lebih baik diarahkan ke halaman daftar laporan LPPM,
  // tapi untuk saat ini kita arahkan ke halaman verifikasi DPL
  revalidatePath(`/dashboard/verifikasi-laporan`);
  redirect(`/dashboard/verifikasi-laporan`);
}
