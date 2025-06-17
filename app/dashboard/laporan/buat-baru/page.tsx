    import { createClient } from "@/lib/supabase/server";
    import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card";
    import { CreateLaporanForm } from "@/components/create-laporan-form";

    export default async function BuatLaporanPage() {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id || '')
        .single();
      
      if (profile?.role !== 'MAHASISWA') {
        return (
           <Card>
            <CardHeader>
              <CardTitle>Akses Ditolak</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Hanya mahasiswa yang dapat membuat laporan baru.</p>
            </CardContent>
          </Card>
        );
      }

      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Formulir Laporan Kegiatan</CardTitle>
              <CardDescription>
                Isi semua detail kegiatan penelitian atau pengabdian masyarakat Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateLaporanForm />
            </CardContent>
          </Card>
        </div>
      );
    }
    