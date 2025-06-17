import { createClient } from "@/lib/supabase/server";
import { type Database } from "@/lib/database.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { LaporanTableToolbar } from "@/components/laporan-table-toolbar";

// Definisikan tipe untuk status laporan dari enum database
type ReportStatus = Database["public"]["Enums"]["report_status"];

// FIX: Definisikan interface yang lebih lengkap sesuai standar Next.js Page Props
interface LaporanPenelitianPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Disetujui":
      return "default";
    case "Revisi":
      return "destructive";
    case "Menunggu Verifikasi":
      return "secondary";
    default:
      return "outline";
  }
};

export default async function LaporanPenelitianPage({
  searchParams,
}: LaporanPenelitianPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Silakan login untuk mengakses halaman ini.</p>;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "LPPM") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Akses Ditolak</CardTitle>
          <CardDescription>
            Hanya administrator LPPM yang dapat mengakses halaman ini.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const query = searchParams?.q?.toString();
  const status = searchParams?.status?.toString();
  const dpl = searchParams?.dpl?.toString();

  let laporanQuery = supabase
    .from("laporan")
    .select(
      `
      id,
      judul_kegiatan,
      tanggal_kegiatan,
      status,
      mahasiswa:profiles!laporan_mahasiswa_id_fkey(full_name),
      dpl:profiles!laporan_dpl_id_fkey(full_name, id)
    `
    )
    .order("created_at", { ascending: false });

  if (query) {
    laporanQuery = laporanQuery.ilike('judul_kegiatan', `%${query}%`);
  }
  if (status && status !== 'all') {
    laporanQuery = laporanQuery.eq('status', status as ReportStatus);
  }
  if (dpl && dpl !== 'all') {
    laporanQuery = laporanQuery.eq('dpl_id', dpl);
  }

  const { data: laporan, error } = await laporanQuery;

  const { data: dplList } = await supabase.from('profiles').select('id, full_name').eq('role', 'DPL');


  if (error) {
    return <p>Gagal memuat daftar laporan: {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Semua Laporan Penelitian & Pengabdian</CardTitle>
          <CardDescription>
            Daftar semua laporan yang diajukan oleh seluruh mahasiswa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
              <LaporanTableToolbar dplList={dplList || []} />
              <PrintButton />
          </div>
          {laporan.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>Judul Laporan</TableHead>
                  <TableHead>DPL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right print:hidden">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laporan.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.mahasiswa?.full_name || "N/A"}
                    </TableCell>
                    <TableCell>{item.judul_kegiatan}</TableCell>
                    <TableCell>{item.dpl?.full_name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(item.status)}
                        className={
                          item.status === "Disetujui"
                            ? "bg-green-600 text-white"
                            : ""
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right print:hidden">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/laporan/detail/${item.id}`}>
                          Lihat Detail
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                Tidak Ada Hasil
              </h3>
              <p className="text-sm text-muted-foreground">
                Tidak ditemukan laporan yang sesuai dengan kriteria filter Anda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
