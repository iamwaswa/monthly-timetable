import { useCallback, useState } from "react";

export function useYear(): [number, (year: string) => void] {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const guardedSetYear = useCallback((year: string) => {
    try {
      setYear(Number.parseInt(year));
    } catch {}
  }, []);

  return [year, guardedSetYear];
}
