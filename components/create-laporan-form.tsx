    "use client";

    import { useActionState } from "react";
    import { useFormStatus } from "react-dom";
    import { createLaporan } from "@/app/dashboard/laporan/actions";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Textarea } from "@/components/ui/textarea";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Calendar } from "@/components/ui/calendar";
    import { CalendarIcon } from "lucide-react";
    import { format } from "date-fns";
    import { useState } from "react";
    import { cn } from "@/lib/utils";

    const initialState = { message: "", errors: {} };

    function SubmitButton() {
        const { pending } = useFormStatus();
        return (
            <Button type="submit" aria-disabled={pending} disabled={pending} size="lg">
                {pending ? "Mengirim Laporan..." : "Kirim Laporan"}
            </Button>
        );
    }

    export function CreateLaporanForm() {
        const [state, formAction] = useActionState(createLaporan, initialState);
        const [date, setDate] = useState<Date>();

        return (
            <form action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri */}
                    <div className="space-y-6">
                         <div>
                            <Label htmlFor="judul_kegiatan">Judul Kegiatan</Label>
                            <Input id="judul_kegiatan" name="judul_kegiatan" required />
                            {state.errors?.judul_kegiatan && <p className="text-sm text-red-500 mt-1">{state.errors.judul_kegiatan[0]}</p>}
                        </div>
                        <div>
                            <Label htmlFor="tanggal_kegiatan">Tanggal Kegiatan</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <input type="hidden" name="tanggal_kegiatan" value={date?.toISOString()} />
                            {state.errors?.tanggal_kegiatan && <p className="text-sm text-red-500 mt-1">{state.errors.tanggal_kegiatan[0]}</p>}
                        </div>
                        <div>
                            <Label htmlFor="bidang_penelitian">Bidang Penelitian</Label>
                             <Select name="bidang_penelitian">
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih bidang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                                    <SelectItem value="Sosial">Sosial</SelectItem>
                                    <SelectItem value="Sains & Teknologi">Sains & Teknologi</SelectItem>
                                    <SelectItem value="Ekonomi">Ekonomi</SelectItem>
                                    <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                                    <SelectItem value="Seni & Budaya">Seni & Budaya</SelectItem>
                                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                            {state.errors?.bidang_penelitian && <p className="text-sm text-red-500 mt-1">{state.errors.bidang_penelitian[0]}</p>}
                        </div>
                        <div>
                            <Label htmlFor="tempat_pelaksanaan">Tempat Pelaksanaan</Label>
                            <Input id="tempat_pelaksanaan" name="tempat_pelaksanaan" />
                        </div>
                         <div>
                            <Label htmlFor="mahasiswa_terlibat">Mahasiswa Terlibat (pisahkan dengan koma)</Label>
                            <Input id="mahasiswa_terlibat" name="mahasiswa_terlibat" placeholder="Contoh: John Doe, Jane Doe" />
                        </div>
                    </div>
                    {/* Kolom Kanan */}
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="narasumber">Narasumber</Label>
                            <Input id="narasumber" name="narasumber" />
                        </div>
                        <div>
                            <Label htmlFor="unsur_terlibat">Unsur yang Terlibat</Label>
                            <Input id="unsur_terlibat" name="unsur_terlibat" placeholder="Contoh: Pemerintah Desa, Karang Taruna"/>
                        </div>
                        <div>
                            <Label htmlFor="deskripsi_kegiatan">Deskripsi Kegiatan</Label>
                            <Textarea id="deskripsi_kegiatan" name="deskripsi_kegiatan" rows={5} />
                        </div>
                         <div>
                            <Label htmlFor="rencana_tindak_lanjut">Rencana Tindak Lanjut</Label>
                            <Textarea id="rencana_tindak_lanjut" name="rencana_tindak_lanjut" rows={3} />
                        </div>
                    </div>
                </div>
                {/* Bagian Bawah */}
                <div className="space-y-6 pt-6 border-t">
                    <div>
                        <Label htmlFor="dokumen_pendukung">Dokumen Pendukung (PDF, Word, JPG, dll)</Label>
                        <Input id="dokumen_pendukung" name="dokumen_pendukung" type="file" required />
                        {state.errors?.dokumen_pendukung && <p className="text-sm text-red-500 mt-1">{state.errors.dokumen_pendukung[0]}</p>}
                    </div>
                </div>

                {state.message && !state.message.includes("berhasil") && (
                    <p className="text-sm text-red-500">{state.message}</p>
                )}
                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </form>
        );
    }
    