import { daysOfTheWeek, monthsOfTheYear } from "~/constants";

export type DayOfTheWeek = typeof daysOfTheWeek[number];

export type MonthOfTheYear = typeof monthsOfTheYear[number];

export type Task = {
  color: string;
  text: string;
};

export type DayTasks = Record<DayOfTheWeek, Task>;
