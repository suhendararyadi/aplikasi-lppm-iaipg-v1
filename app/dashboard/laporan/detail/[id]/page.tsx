import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { type AppPageProps } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Download, MessageSquareQuote, ChevronLeft } from "lucide-react";

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
  value: string | string[] | null | undefined;
}) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground">{label}</h3>
      {Array.isArray(value) ? (
        <p className="text-base">{value.join(", ")}</p>
      ) : (
        <p className="text-base whitespace-pre-wrap">{value}</p>
      )}
    </div>
  );
};

export default async function DetailLaporanPage({
  params,
}: AppPageProps<{ id: string }>) {
  const supabase = await createClient();

  const laporanId = Number(params.id);

  if (isNaN(laporanId)) {
    notFound();
  }

  const { data: laporan, error } = await supabase
    .from("laporan")
    .select(
      `
      *,
      mahasiswa:profiles!laporan_mahasiswa_id_fkey(full_name),
      dpl:profiles!laporan_dpl_id_fkey(full_name)
    `
    )
    .eq("id", laporanId)
    .single();

  if (error || !laporan) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <Link href="/dashboard/laporan/riwayat" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
           <ChevronLeft className="mr-1 h-4 w-4" /> Kembali ke Riwayat
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
              value={format(new Date(laporan.tanggal_kegiatan), "dd MMMM yyyy", {
                locale: id,
              })}
            />
            <DetailItem
              label="Bidang Penelitian"
              value={laporan.bidang_penelitian}
            />
            <DetailItem
              label="Tempat Pelaksanaan"
              value={laporan.tempat_pelaksanaan}
            />
             <DetailItem label="Narasumber" value={laporan.narasumber} />
            <DetailItem
              label="Mahasiswa Terlibat"
              value={laporan.mahasiswa_terlibat}
            />
            <DetailItem
              label="Unsur yang Terlibat"
              value={laporan.unsur_terlibat}
            />
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
    </div>
  );
}
