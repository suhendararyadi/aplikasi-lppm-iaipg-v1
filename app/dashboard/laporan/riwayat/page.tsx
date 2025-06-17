import { createClient } from "@/lib/supabase/server";
import { type AppPageProps } from "@/lib/types"; // <- Gunakan nama tipe baru
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
import { id } from 'date-fns/locale';
import Link from "next/link";
import { CircleCheck, FileText } from "lucide-react";

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Disetujui':
            return 'default';
        case 'Revisi':
            return 'destructive';
        case 'Menunggu Verifikasi':
            return 'secondary';
        default:
            return 'outline';
    }
}

export default async function RiwayatLaporanPage({ searchParams }: AppPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Silakan login untuk melihat riwayat.</p>;
  }

  const { data: laporan, error } = await supabase
    .from("laporan")
    .select("*")
    .eq("mahasiswa_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return <p>Gagal memuat riwayat laporan: {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      {searchParams.success && (
        <div className="flex items-center gap-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
            <CircleCheck className="h-5 w-5"/>
            <p className="text-sm font-medium">Laporan berhasil dikirim dan sedang menunggu verifikasi dari DPL Anda.</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Laporan Anda</CardTitle>
          <CardDescription>
            Semua laporan penelitian dan pengabdian yang telah Anda ajukan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {laporan.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Kegiatan</TableHead>
                  <TableHead>Tanggal Kegiatan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laporan.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.judul_kegiatan}
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.tanggal_kegiatan), "dd MMMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(item.status)}
                        className={item.status === 'Disetujui' ? 'bg-green-600 text-white' : ''}
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
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Belum Ada Laporan</h3>
                <p className="text-sm text-muted-foreground">
                    Anda belum pernah mengajukan laporan. Mulai dengan membuat laporan baru.
                </p>
                <Button asChild>
                    <Link href="/dashboard/laporan/buat-baru">Buat Laporan Baru</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
