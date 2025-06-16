import { createClient } from "@/lib/supabase/server"; // User-scope client
import { createAdminClient } from "@/lib/supabase/admin"; // Admin-scope client
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
import { type SupabaseClient } from '@supabase/supabase-js'
import { type Database } from '@/lib/database.types'

// Fungsi ini sekarang menggunakan tipe data yang benar untuk Supabase client
async function getUserRole(supabase: SupabaseClient<Database>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role;
}

export default async function UserManagementPage() {
  const supabase = createClient(); // Client standar untuk cek role user saat ini
  
  const role = await getUserRole(supabase);

  // Amankan halaman, hanya LPPM yang boleh akses
  if (role !== 'LPPM') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Akses Ditolak</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Gunakan admin client untuk operasi yang memerlukan hak akses lebih
  const supabaseAdmin = createAdminClient(); 

  // Fetch semua user dari auth untuk mendapatkan email
  const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (usersError) {
      console.error("Error fetching users:", usersError);
      return <div>Terjadi kesalahan saat mengambil data pengguna.</div>;
  }
  
  // Buat map untuk mencocokkan id dengan email
  const userEmailMap = new Map(users.map(user => [user.id, user.email ?? 'No email']));

  // Ambil semua data profil untuk ditampilkan
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*");

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return <div>Terjadi kesalahan saat mengambil data profil.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manajemen User</h1>
        <Button>Tambah User</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Kelola semua pengguna yang terdaftar di sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>NIP/NIM</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    {profile.full_name || "Belum diisi"}
                  </TableCell>
                  <TableCell>
                    {userEmailMap.get(profile.id) || 'Email tidak ditemukan'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.role === 'LPPM' ? 'default' : 'secondary'}>
                      {profile.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{profile.identity_number || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Edit
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
