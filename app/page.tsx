import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogIn,
  FilePlus2,
  UserCheck,
  BarChart3,
  BookCopy,
} from "lucide-react";
// import ThemeSwitcher from "@/components/theme-switcher"; // Dihapus sementara

// Komponen Header
const LandingHeader = () => (
  <header className="w-full">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 border-b border-border">
        <div className="flex items-center space-x-2">
          <BookCopy className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            LPPM IAIPG
          </span>
        </div>
        <div className="flex items-center space-x-2">
           {/* <ThemeSwitcher /> */} {/* Dihapus sementara */}
           <Button asChild>
            <Link href="/auth/login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  </header>
);

// Komponen Hero
const LandingHero = () => (
  <section className="text-center py-20 lg:py-32">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground">
        Sistem Informasi Laporan Penelitian & Pengabdian
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
        Digitalisasi pelaporan untuk efisiensi dan transparansi kegiatan
        penelitian serta pengabdian masyarakat di LPPM IAI Persis Garut.
      </p>
      <div className="mt-8">
        <Button size="lg" asChild>
          <Link href="/auth/login">Mulai Pelaporan</Link>
        </Button>
      </div>
    </div>
  </section>
);

// Komponen Kartu Fitur
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="text-center">
    <CardHeader>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Komponen Bagian Fitur
const FeaturesSection = () => (
  <section className="py-16 bg-muted/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Dirancang untuk Setiap Peran
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Fitur yang disesuaikan untuk mempermudah alur kerja Mahasiswa, DPL,
          dan LPPM.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<FilePlus2 className="h-6 w-6" />}
          title="Untuk Mahasiswa"
          description="Ajukan laporan kegiatan penelitian dan pengabdian dengan mudah melalui formulir online yang terstruktur."
        />
        <FeatureCard
          icon={<UserCheck className="h-6 w-6" />}
          title="Untuk DPL"
          description="Verifikasi laporan mahasiswa bimbingan, berikan feedback, dan setujui laporan secara digital."
        />
        <FeatureCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Untuk LPPM"
          description="Kelola pengguna, pantau semua laporan, dan hasilkan rekapitulasi data secara otomatis untuk akreditasi."
        />
      </div>
    </div>
  </section>
);

// Komponen Footer
const LandingFooter = () => (
    <footer className="border-t">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} LPPM IAI Persis Garut. All rights reserved.
            </p>
        </div>
    </footer>
);


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <FeaturesSection />
      </main>
      <LandingFooter />
    </div>
  );
}
