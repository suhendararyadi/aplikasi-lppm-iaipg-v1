import { createClient } from "@/lib/supabase/server";
import { type AppPageProps } from "@/lib/types";
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
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { FileClock } from "lucide-react";

// Helper untuk Badge Status, kita bisa pindahkan ini ke file utils nanti
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

export default async function VerifikasiLaporanPage({
  // searchParams,
}: AppPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Silakan login untuk mengakses halaman ini.</p>;
  }

  // Ambil data laporan yang perlu diverifikasi oleh DPL yang sedang login
  const { data: laporan, error } = await supabase
    .from("laporan")
    .select(
      `
      id,
      judul_kegiatan,
      tanggal_kegiatan,
      status,
      mahasiswa:profiles!laporan_mahasiswa_id_fkey(full_name)
    `
    )
    .eq("dpl_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return <p>Gagal memuat daftar laporan: {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verifikasi Laporan</CardTitle>
          <CardDescription>
            Daftar laporan dari mahasiswa bimbingan Anda yang menunggu
            tindakan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {laporan.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Mahasiswa</TableHead>
                  <TableHead>Judul Laporan</TableHead>
                  <TableHead>Tanggal Pengajuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laporan.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.mahasiswa?.full_name || "N/A"}
                    </TableCell>
                    <TableCell>{item.judul_kegiatan}</TableCell>
                    <TableCell>
                      {format(new Date(item.tanggal_kegiatan), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </TableCell>
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
                    <TableCell className="text-right">
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
                <FileClock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                Tidak Ada Laporan
              </h3>
              <p className="text-sm text-muted-foreground">
                Saat ini tidak ada laporan yang perlu Anda verifikasi.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
