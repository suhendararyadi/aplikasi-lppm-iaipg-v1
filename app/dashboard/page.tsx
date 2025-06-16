import { createClient } from "@/lib/supabase/server";
import { DplOverview } from "@/components/dpl-overview";
import { LppmOverview } from "@/components/lppm-overview";
import { MahasiswaOverview } from "@/components/mahasiswa-overview";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type SupabaseClient } from "@supabase/supabase-js";
import { type Database } from "@/lib/database.types";

// FIX: Memperbaiki tipe data parameter supabase
async function getProfile(supabase: SupabaseClient<Database>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();
  
  return profile;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const profile = await getProfile(supabase);

  const renderOverview = () => {
    switch (profile?.role) {
      case 'LPPM':
        return <LppmOverview />;
      case 'DPL':
        return <DplOverview />;
      case 'MAHASISWA':
        return <MahasiswaOverview />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Selamat Datang</CardTitle>
              <CardDescription>
                Peran Anda belum diatur. Silakan hubungi administrator.
              </CardDescription>
            </CardHeader>
          </Card>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold tracking-tight">
            Selamat Datang, {profile?.full_name || 'Pengguna'}!
        </h2>
        {renderOverview()}
    </div>
  );
}
