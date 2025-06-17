// lib/types.ts

// Tipe data ini akan kita gunakan untuk semua halaman
// agar konsisten dan mudah dikelola.
export type PageProps<T extends Record<string, string> = {}> = {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
};
