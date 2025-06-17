"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type DPLProfile = Pick<Profile, "id" | "full_name">;
type ReportStatus = Database["public"]["Enums"]["report_status"];

interface LaporanTableToolbarProps {
  dplList: DPLProfile[];
}

export function LaporanTableToolbar({ dplList }: LaporanTableToolbarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (type: 'status' | 'dpl', value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
     if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const statuses: ReportStatus[] = ["Menunggu Verifikasi", "Revisi", "Disetujui"];

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Cari judul atau mahasiswa..."
          defaultValue={searchParams.get('q')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Select
            value={searchParams.get('status')?.toString() ?? 'all'}
            onValueChange={(value) => handleFilterChange('status', value)}
        >
            <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
            </SelectContent>
        </Select>
         <Select
            value={searchParams.get('dpl')?.toString() ?? 'all'}
            onValueChange={(value) => handleFilterChange('dpl', value)}
        >
            <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Filter DPL" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua DPL</SelectItem>
                {dplList.map(dpl => (
                    <SelectItem key={dpl.id} value={dpl.id}>{dpl.full_name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
    </div>
  );
}
