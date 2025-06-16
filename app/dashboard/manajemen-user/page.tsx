import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
import { type SupabaseClient } from '@supabase/supabase-js'
import { type Database } from '@/lib/database.types'
import { AddUserDialog } from "@/components/add-user-dialog";
import { UserTableActions } from "@/components/user-table-actions";

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
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const role = await getUserRole(supabase);

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
  
  const supabaseAdmin = createAdminClient(); 

  const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (usersError) {
      console.error("Error fetching users:", usersError);
      return <div>Terjadi kesalahan saat mengambil data pengguna.</div>;
  }
  
  const userEmailMap = new Map(users.map(user => [user.id, user.email ?? 'No email']));

  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*");

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return <div>Terjadi kesalahan saat mengambil data profil.</div>;
  }

  const { data: dplList } = await supabase.from('profiles').select('id, full_name').eq('role', 'DPL');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manajemen User</h1>
        <AddUserDialog dplList={dplList || []} />
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
                    <UserTableActions 
                      profile={profile} 
                      dplList={dplList || []} 
                      currentUserId={currentUser?.id} 
                    />
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
