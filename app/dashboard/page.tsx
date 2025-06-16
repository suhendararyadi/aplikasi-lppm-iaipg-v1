import { createClient } from "@/lib/supabase/server";
// import { redirect } from "next/navigation"; // Dihapus karena layout yang menangani
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoIcon, Package, Users, Activity, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  // User sudah diautentikasi oleh layout, tapi kita mungkin butuh info user untuk tampilan
  const supabase = await createClient(); 
  const { data: { user } } = await supabase.auth.getUser(); 
  // Tidak perlu redirect di sini, layout yang menangani.
  // Kita asumsikan user tidak null jika sampai di sini.

  // Placeholder data - Anda bisa menggantinya dengan data dinamis dari Supabase
  const stats = [
    {
      title: "Total Pengguna",
      value: "1,250",
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
      description: "+20.1% dari bulan lalu",
    },
    {
      title: "Penelitian Aktif",
      value: "35",
      icon: <Package className="h-5 w-5 text-muted-foreground" />,
      description: "+10 dari bulan lalu",
    },
    {
      title: "Pengabdian Masyarakat",
      value: "20",
      icon: <Activity className="h-5 w-5 text-muted-foreground" />,
      description: "+5 dari bulan lalu",
    },
    {
      title: "Dana Penelitian",
      value: "Rp 150.000.000",
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
      description: "Tahun Anggaran 2024",
    },
  ];

  return (
    <div className="flex flex-col gap-8"> {/* flex-1 w-full dihapus, diatur oleh layout */}
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          Selamat datang kembali, {user?.email}! {/* Gunakan optional chaining */}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Grafik Aktivitas Penelitian</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Placeholder untuk grafik, Anda bisa menggunakan library seperti Recharts atau Chart.js */}
            <div className="h-[350px] w-full bg-muted/50 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">
                Placeholder untuk Grafik Aktivitas
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Pengumuman Terbaru</CardTitle>
            <CardDescription>
              Informasi dan pengumuman penting dari LPPM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder untuk daftar pengumuman */}
            <div className="space-y-4">
              {[
                "Batas akhir pengumpulan proposal penelitian tahap II.",
                "Jadwal seminar hasil penelitian.",
                "Workshop penulisan artikel ilmiah.",
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-1">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Anda bisa menambahkan komponen lain di sini */}
    </div>
  );
}
