"use client";

import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, MessageSquareQuote, ChevronLeft, Loader2 } from "lucide-react";
import { DplActionForm } from "@/components/dpl-action-form";
import { useEffect, useState } from "react";
import { type Database } from "@/lib/database.types";
import { ClientFormattedDate } from "@/components/client-formatted-date";

// Definisikan tipe data untuk laporan yang kita fetch
type LaporanDetail = Database["public"]["Tables"]["laporan"]["Row"] & {
  mahasiswa: { full_name: string | null } | null;
  dpl: { full_name: string | null } | null;
};

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

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  // Check if value is a string and empty, or an array and empty
  if (typeof value === 'string' && !value.trim()) return null;
  if (Array.isArray(value) && value.length === 0) return null;
  if (!value) return null;
  
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground">{label}</h3>
        <div className="text-base whitespace-pre-wrap">{value}</div>
    </div>
  );
};

export default function DetailLaporanPage({
  params,
}: {
  params: { id: string };
}) {
  const [laporan, setLaporan] = useState<LaporanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDplForThisReport, setIsDplForThisReport] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string|null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function fetchData() {
      const laporanId = Number(params.id);
      if (isNaN(laporanId)) {
        notFound();
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setCurrentUserRole(profile?.role || null);
      }

      const { data: reportData, error } = await supabase
        .from("laporan")
        .select(`*, mahasiswa:profiles!laporan_mahasiswa_id_fkey(full_name), dpl:profiles!laporan_dpl_id_fkey(full_name)`)
        .eq("id", laporanId)
        .single();

      if (error || !reportData) {
        notFound();
        return;
      }

      setLaporan(reportData as LaporanDetail);
      if (user && user.id === reportData.dpl_id) {
        setIsDplForThisReport(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!laporan) {
    return notFound();
  }
  
  const isPendingVerification = laporan.status === 'Menunggu Verifikasi';
  const isLppm = currentUserRole === 'LPPM';
  const canTakeAction = (isDplForThisReport || isLppm) && isPendingVerification;

  return (
    <div className="space-y-6">
       <Link href={ isLppm ? "/dashboard/laporan-penelitian" : (isDplForThisReport ? "/dashboard/verifikasi-laporan" : "/dashboard/laporan/riwayat")} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
           <ChevronLeft className="mr-1 h-4 w-4" /> Kembali ke Daftar Laporan
       </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-1">{laporan.judul_kegiatan}</CardTitle>
              <CardDescription>
                Diajukan oleh: {laporan.mahasiswa?.full_name || "N/A"}
              </CardDescription>
            </div>
            <Badge
              variant={getStatusVariant(laporan.status)}
              className={`text-sm ${
                laporan.status === "Disetujui" ? "bg-green-600 text-white" : ""
              }`}
            >
              {laporan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DetailItem
              label="Tanggal Kegiatan"
              value={<ClientFormattedDate dateString={laporan.tanggal_kegiatan} />}
            />
            <DetailItem label="Bidang Penelitian" value={laporan.bidang_penelitian} />
            <DetailItem label="Tempat Pelaksanaan" value={laporan.tempat_pelaksanaan} />
            <DetailItem label="Narasumber" value={laporan.narasumber} />
            <DetailItem label="Mahasiswa Terlibat" value={laporan.mahasiswa_terlibat?.join(", ")} />
            <DetailItem label="Unsur yang Terlibat" value={laporan.unsur_terlibat} />
          </div>
          <div className="space-y-6 pt-6 border-t">
             <DetailItem label="Deskripsi Kegiatan" value={laporan.deskripsi_kegiatan} />
             <DetailItem label="Rencana Tindak Lanjut" value={laporan.rencana_tindak_lanjut} />
          </div>
          {laporan.feedback_dpl && (
             <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
                    Catatan / Feedback dari DPL
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{laporan.feedback_dpl}</p>
            </div>
          )}
          {laporan.dokumen_pendukung_url && (
            <div className="pt-6 border-t">
                 <Button asChild>
                    <a href={laporan.dokumen_pendukung_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Unduh Dokumen Pendukung
                    </a>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {canTakeAction && (
        <DplActionForm laporanId={laporan.id} />
      )}
    </div>
  );
}
