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
    try {
      setFormattedDate(format(new Date(dateString), formatString, { locale: id }));
    } catch {
        setFormattedDate(dateString);
    }
  }, [dateString, formatString]);
  
  return <>{formattedDate || dateString}</>;
}
