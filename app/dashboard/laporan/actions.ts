    "use server";

    import { createClient } from "@/lib/supabase/server";
    import { revalidatePath } from "next/cache";
    import { redirect } from "next/navigation";
    import { z } from "zod";

    const LaporanSchema = z.object({
        tanggal_kegiatan: z.string().min(1, "Tanggal kegiatan harus diisi"),
        bidang_penelitian: z.enum(["Pendidikan", "Sosial", "Sains & Teknologi", "Ekonomi", "Kesehatan", "Seni & Budaya", "Lainnya"]),
        judul_kegiatan: z.string().min(1, "Judul kegiatan tidak boleh kosong"),
        tempat_pelaksanaan: z.string().optional(),
        narasumber: z.string().optional(),
        mahasiswa_terlibat: z.string().optional(),
        unsur_terlibat: z.string().optional(),
        deskripsi_kegiatan: z.string().optional(),
        rencana_tindak_lanjut: z.string().optional(),
        dokumen_pendukung: z.instanceof(File).refine(file => file.size > 0, 'Dokumen pendukung harus diunggah.').optional()
    });

    export async function createLaporan(prevState: any, formData: FormData) {
        const validatedFields = LaporanSchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!validatedFields.success) {
            return {
                message: "Data tidak valid.",
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { message: "Otentikasi gagal." };
        }

        // Ambil profil mahasiswa untuk mendapatkan DPL ID nya
        const { data: profile } = await supabase.from('profiles').select('dpl_id').eq('id', user.id).single();
        if (!profile || !profile.dpl_id) {
            return { message: "Anda tidak terhubung dengan DPL." };
        }

        const { dokumen_pendukung, mahasiswa_terlibat, ...laporanData } = validatedFields.data;
        let dokumen_pendukung_url = null;

        // Handle upload file
        if (dokumen_pendukung && dokumen_pendukung.size > 0) {
            const filePath = `${user.id}/${Date.now()}-${dokumen_pendukung.name}`;
            const { error: uploadError } = await supabase.storage
                .from('dokumen-laporan')
                .upload(filePath, dokumen_pendukung);

            if (uploadError) {
                return { message: `Gagal mengunggah file: ${uploadError.message}` };
            }
            
            const { data: publicUrlData } = supabase.storage
                .from('dokumen-laporan')
                .getPublicUrl(filePath);

            dokumen_pendukung_url = publicUrlData.publicUrl;
        }

        const { error: insertError } = await supabase.from('laporan').insert({
            ...laporanData,
            dokumen_pendukung_url,
            mahasiswa_terlibat: mahasiswa_terlibat?.split(',').map(name => name.trim()) || [],
            mahasiswa_id: user.id,
            dpl_id: profile.dpl_id,
        });

        if (insertError) {
             return { message: `Gagal menyimpan laporan: ${insertError.message}` };
        }

        revalidatePath("/dashboard/laporan/riwayat");
        redirect("/dashboard/laporan/riwayat?success=true");
    }
    