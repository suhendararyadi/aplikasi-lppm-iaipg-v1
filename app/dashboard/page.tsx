import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Users, BookOpenCheck, DollarSign } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Placeholder data - Anda bisa menggantinya dengan data dinamis dari Supabase
  const stats = [
    {
      title: "Total Penelitian",
      value: "35",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      description: "+10 dari bulan lalu",
    },
    {
      title: "Total Pengabdian",
      value: "20",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "+5 dari bulan lalu",
    },
    {
      title: "Total Publikasi",
      value: "15",
      icon: <BookOpenCheck className="h-4 w-4 text-muted-foreground" />,
      description: "+3 dari bulan lalu",
    },
    {
      title: "Dana Terserap",
      value: "Rp 150 Jt",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: "Tahun Anggaran 2024",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* Placeholder untuk Date Picker */}
          <Button>Download</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Grafik Aktivitas</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px] w-full bg-muted/50 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Placeholder untuk Grafik
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-4 md:col-span-3">
              <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>
                  Ada 5 laporan baru yang perlu diverifikasi.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder untuk daftar aktivitas */}
                <div className="space-y-8">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Olivia Martin
                      </p>
                      <p className="text-sm text-muted-foreground">
                        olivia.martin@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+Rp 1.999.000</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
