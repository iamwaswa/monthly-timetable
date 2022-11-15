import { useCallback, useState } from "react";

import { monthsOfTheYear } from "~/constants";
import type { MonthOfTheYear } from "~/types";
import { isMonthOfTheYear } from "~/utils";

export function useMonth(): [MonthOfTheYear, (month: string) => void] {
  const [month, setMonth] = useState<MonthOfTheYear>(
    monthsOfTheYear[new Date().getMonth()]
  );

  const guardedSetMonth = useCallback((month: string) => {
    if (isMonthOfTheYear(month)) {
      setMonth(month);
    }
  }, []);

  return [month, guardedSetMonth];
}
