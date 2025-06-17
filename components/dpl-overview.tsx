import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, FileClock, FileCheck2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ClientFormattedDate } from "./client-formatted-date";

interface DplOverviewProps {
  stats: {
    totalMahasiswa: number;
    pendingReports: number;
    approvedReports: number;
  };
  recentReports: {
    id: number;
    judul_kegiatan: string;
    tanggal_kegiatan: string;
    mahasiswa: { full_name: string | null } | null;
  }[];
}

export function DplOverview({ stats, recentReports }: DplOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mahasiswa Bimbingan
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMahasiswa}</div>
            <p className="text-xs text-muted-foreground">Total mahasiswa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Perlu Diverifikasi
            </CardTitle>
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
             <p className="text-xs text-muted-foreground">Laporan baru masuk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telah Diverifikasi</CardTitle>
            <FileCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedReports}</div>
             <p className="text-xs text-muted-foreground">Total laporan selesai</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Laporan Masuk Terbaru</CardTitle>
          <CardDescription>
            Laporan dari mahasiswa bimbingan Anda yang menunggu verifikasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>Judul Laporan</TableHead>
                <TableHead>Tanggal Kegiatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map(report => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.mahasiswa?.full_name || 'N/A'}</TableCell>
                  <TableCell>{report.judul_kegiatan}</TableCell>
                  <TableCell>
                    <ClientFormattedDate dateString={report.tanggal_kegiatan} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/laporan/detail/${report.id}`}>Verifikasi</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
