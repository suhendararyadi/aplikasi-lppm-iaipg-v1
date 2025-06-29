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
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

type LppmStats = { totalUsers: number; totalDpl: number; totalMahasiswa: number; pendingReports: number; };
type DplStats = { totalMahasiswa: number; pendingReports: number; approvedReports: number; };
type MahasiswaStats = { totalLaporan: number; approvedReports: number; pendingReports: number; };

// Define types for chart data and activities
type ChartDataItem = {
  name: string;
  total: number;
};
type ChartData = ChartDataItem[];
type RecentActivity = {
  id: number;
  judul_kegiatan: string;
  mahasiswa: { full_name: string | null } | null;
};
type DplRecentReport = {
  id: number;
  judul_kegiatan: string;
  tanggal_kegiatan: string;
  mahasiswa: { full_name: string | null } | null;
};
type MahasiswaRecentReport = {
  id: number;
  judul_kegiatan: string;
  status: string;
};

async function DashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <p>User tidak ditemukan.</p>;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.role) {
     return (
          <Card>
            <CardHeader>
              <CardTitle>Profil tidak lengkap</CardTitle>
              <CardDescription>
                Peran Anda belum diatur. Silakan hubungi administrator.
              </CardDescription>
            </CardHeader>
          </Card>
        );
  }

  const role = profile.role;
  let stats: LppmStats | DplStats | MahasiswaStats | undefined;
  let chartData: ChartData | undefined;
  let recentActivities: RecentActivity[] | undefined;
  let dplRecentReports: DplRecentReport[] | undefined;
  let mahasiswaRecentReports: MahasiswaRecentReport[] | undefined;

  if (role === "LPPM") {
    const { data: chartResult } = await supabase.rpc('get_report_stats_by_field' as never);
    chartData = chartResult ? (chartResult as unknown as ChartDataItem[]) : [];

    const [{ count: totalUsers }, { count: totalDpl }, { count: totalMahasiswa }, { count: pendingReports }, { data: activities }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq('role', 'DPL'),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq('role', 'MAHASISWA'),
      supabase.from("laporan").select("*", { count: "exact", head: true }).eq('status', 'Menunggu Verifikasi'),
      supabase.from("laporan").select("id, judul_kegiatan, mahasiswa:profiles!laporan_mahasiswa_id_fkey(full_name)").order("created_at", { ascending: false }).limit(5)
    ]);
    stats = { totalUsers: totalUsers ?? 0, totalDpl: totalDpl ?? 0, totalMahasiswa: totalMahasiswa ?? 0, pendingReports: pendingReports ?? 0 };
    recentActivities = activities ? (activities as unknown as RecentActivity[]) : [];
  } else if (role === "DPL") {
    const [{ count: totalMahasiswa }, { count: pendingReports }, { count: approvedReports }, { data: reports }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("dpl_id", user.id),
      supabase.from("laporan").select("*", { count: "exact", head: true }).eq("dpl_id", user.id).eq("status", "Menunggu Verifikasi"),
      supabase.from("laporan").select("*", { count: "exact", head: true }).eq("dpl_id", user.id).eq("status", "Disetujui"),
      supabase.from("laporan").select("id, judul_kegiatan, tanggal_kegiatan, mahasiswa:profiles!laporan_mahasiswa_id_fkey(full_name)").eq("dpl_id", user.id).eq("status", "Menunggu Verifikasi").order("created_at", { ascending: false }).limit(5)
    ]);
    stats = { totalMahasiswa: totalMahasiswa ?? 0, pendingReports: pendingReports ?? 0, approvedReports: approvedReports ?? 0 };
    dplRecentReports = reports ? (reports as unknown as DplRecentReport[]) : [];
  } else { // Mahasiswa
    const [{ count: totalLaporan }, { count: approvedReports }, { count: pendingReports }, { data: reports }] = await Promise.all([
        supabase.from("laporan").select("*", { count: "exact", head: true }).eq("mahasiswa_id", user.id),
        supabase.from("laporan").select("*", { count: "exact", head: true }).eq("mahasiswa_id", user.id).eq("status", "Disetujui"),
        supabase.from("laporan").select("*", { count: "exact", head: true }).eq("mahasiswa_id", user.id).eq("status", "Menunggu Verifikasi"),
        supabase.from("laporan").select("id, judul_kegiatan, status").eq("mahasiswa_id", user.id).order("created_at", { ascending: false }).limit(5)
    ]);
    stats = { totalLaporan: totalLaporan ?? 0, approvedReports: approvedReports ?? 0, pendingReports: pendingReports ?? 0 };
    mahasiswaRecentReports = reports ? (reports as unknown as MahasiswaRecentReport[]) : [];
  }

  const renderOverview = () => {
    switch (profile.role) {
      case "LPPM":
        return <LppmOverview stats={stats as LppmStats} chartData={chartData || []} recentActivities={recentActivities || []} />;
      case "DPL":
        return <DplOverview stats={stats as DplStats} recentReports={dplRecentReports || []} />;
      case "MAHASISWA":
        return <MahasiswaOverview stats={stats as MahasiswaStats} recentReports={mahasiswaRecentReports || []} />;
      default:
        return null;
    }
  };

  return (
     <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">
        Selamat Datang, {profile.full_name || "Pengguna"}!
      </h2>
        {renderOverview()}
     </div>
  )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="flex w-full items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
            <DashboardData />
        </Suspense>
    )
}