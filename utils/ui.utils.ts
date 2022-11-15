import { daysOfTheWeek, monthsOfTheYear } from "~/constants";
import type { DayOfTheWeek, DayTasks, MonthOfTheYear, Task } from "~/types";

function getScrollbarWidth() {
  let scrollDiv = document.createElement("div");
  scrollDiv.className = "scrollbar-measure";
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}

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
