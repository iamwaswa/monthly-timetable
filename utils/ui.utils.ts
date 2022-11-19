import { daysOfTheWeek, monthsOfTheYear } from "~/constants";
import type { DayOfTheWeek, DayTasks, MonthOfTheYear, Task } from "~/types";

export function createDayTasks(): Record<DayOfTheWeek, Task> {
  return daysOfTheWeek.reduce(
    (dayTasks, dayOfTheWeek) => ({
      ...dayTasks,
      [dayOfTheWeek]: {
        color: `#000000`,
        text: ``,
      },
    }),
    {} as Record<DayOfTheWeek, Task>
  );
}

export function isDayOfTheWeek(day: unknown): day is DayOfTheWeek {
  return (
    typeof day === "string" &&
    (daysOfTheWeek as unknown as Array<string>).includes(day)
  );
}

export function isMonthOfTheYear(month: unknown): month is MonthOfTheYear {
  return (
    typeof month === "string" &&
    (monthsOfTheYear as unknown as Array<string>).includes(month)
  );
}

export function isValidBrowserStorageItem(value: unknown): value is DayTasks {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.entries(value).every(
      ([day, value]) => isDayOfTheWeek(day) && isTask(value)
    )
  );
}

function isTask(value: unknown): value is Task {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.entries(value).filter(([propertyKey, propertyValue]) => {
      return (
        (propertyKey === `color` && typeof propertyValue === `string`) ||
        (propertyKey === `text` && typeof propertyValue === `string`)
      );
    }).length === 2
  );
}

export function base64StringToUint8Array(base64String: string): Uint8Array {
  const padding = `=`.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, `+`)
    .replace(/_/g, `/`);
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
