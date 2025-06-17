import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FilePlus2, FileClock, FileCheck2, History } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface MahasiswaOverviewProps {
  stats: {
    totalLaporan: number;
    approvedReports: number;
    pendingReports: number;
  };
  recentReports: {
    id: number;
    judul_kegiatan: string;
    status: string;
  }[];
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

export function MahasiswaOverview({ stats, recentReports }: MahasiswaOverviewProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
        <CardHeader>
            <CardTitle className="text-2xl">Buat Laporan Penelitian</CardTitle>
            <CardDescription className="text-primary-foreground/80">
                Laporkan kegiatan penelitian atau pengabdian masyarakat Anda di sini.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="secondary" size="lg" asChild>
                <Link href="/dashboard/laporan/buat-baru">
                    <FilePlus2 className="mr-2 h-5 w-5"/> Buat Laporan Baru
                </Link>
            </Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLaporan}</div>
            <p className="text-xs text-muted-foreground">Telah Anda ajukan</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <FileCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedReports}</div>
            <p className="text-xs text-muted-foreground">Laporan telah disetujui DPL</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Laporan sedang ditinjau</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Status Laporan Terkini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentReports.map(report => (
            <div key={report.id} className="flex justify-between items-center">
                <p className="font-medium">{report.judul_kegiatan}</p>
                <Badge 
                  variant={getStatusVariant(report.status)}
                  className={report.status === 'Disetujui' ? 'bg-green-600 text-white' : ''}
                >
                  {report.status}
                </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
