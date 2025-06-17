// lib/types.ts

// FIX: Mengganti default type dari {} menjadi Record<string, never>
// Ini adalah cara yang lebih aman untuk mendefinisikan objek kosong
// dan akan diterima oleh linter Vercel.
export type PageProps<T extends Record<string, string> = Record<string, never>> = {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
};
