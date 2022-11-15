import { daysOfTheWeek, monthsOfTheYear } from "~/constants";
import type { MonthOfTheYear } from "~/types";

export function createDaysOfTheMonth(
  month: MonthOfTheYear,
  year: number
): Array<Array<number>> {
  const monthIndex = monthsOfTheYear.indexOf(month);
  const numberOfDaysInTheMonth = new Date(year, monthIndex + 1, 0).getDate();

  const daysOfTheMonth: Array<Array<number>> = [];
  let dayOfTheMonth = 1;

  while (dayOfTheMonth <= numberOfDaysInTheMonth) {
    const week = Array(daysOfTheWeek.length)
      .fill(0)
      .map((_, dayOfTheWeekIndex) => {
        if (dayOfTheMonth > numberOfDaysInTheMonth) {
          return 0;
        }

        // Only once the current day has been processed
        // do we proceed to the next day
        if (
          new Date(year, monthIndex, dayOfTheMonth).getDay() ===
          dayOfTheWeekIndex
        ) {
          return dayOfTheMonth++;
        }

        return 0;
      });

    daysOfTheMonth.push(week);
  }

  return daysOfTheMonth;
}
