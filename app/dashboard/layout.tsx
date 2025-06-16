// app/dashboard/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <DashboardSidebar userEmail={user.email} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Anda bisa menambahkan header umum dashboard di sini jika perlu */}
        {/* <header className="h-16 border-b flex items-center px-6 bg-card shadow-sm print:hidden">
          <h1 className="text-xl font-semibold">Dashboard LPPM</h1>
        </header> */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
