"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ClientFormattedDateProps {
  dateString: string;
  formatString?: string;
}

export function ClientFormattedDate({ dateString, formatString = "dd MMMM yyyy" }: ClientFormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Efek ini hanya berjalan di sisi klien setelah proses render awal,
    // sehingga menghindari perbedaan antara server dan browser.
    try {
      setFormattedDate(format(new Date(dateString), formatString, { locale: id }));
    } catch (error) {
        // Jika tanggal tidak valid, tampilkan string aslinya
        setFormattedDate(dateString);
    }
  }, [dateString, formatString]);
  
  // Tampilkan string tanggal asli sebagai placeholder saat render di server
  // atau saat efek belum berjalan.
  return <>{formattedDate || dateString}</>;
}
