// lib/types.ts

// FIX: Mengganti nama 'PageProps' menjadi 'AppPageProps' untuk menghindari tabrakan nama
// dengan tipe internal Next.js.
export type AppPageProps<T extends Record<string, string> = Record<string, never>> = {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
};
