import type { ChangeEvent } from "react";

import { monthsOfTheYear } from "~/constants";
import type { DayOfTheWeek, Task } from "~/types";

import { useMonth } from "./month.hook";
import { usePrint } from "./print.hook";
import { useTasks } from "./tasks.hook";
import { useYear } from "./year.hook";

import { Select } from "./select";
import { TasksForTheMonth } from "./tasksForTheMonth";

export function HomePage() {
  const [tasksForTheMonthRef, printTasksForTheMonth] =
    usePrint<HTMLDivElement>();

  const [month, setMonth] = useMonth();

  const [year, setYear] = useYear();

  const [tasks, setTasks] = useTasks();

  function handleMonthChange(event: ChangeEvent<HTMLSelectElement>) {
    setMonth(event.target.value);
  }

  function handleYearChange(event: ChangeEvent<HTMLSelectElement>) {
    setYear(event.target.value);
  }

  function handleDayTaskChange(key: keyof Task) {
    return (day: DayOfTheWeek, value: string) => {
      setTasks((currentTasks) => {
        return {
          ...currentTasks,
          [day]: {
            ...currentTasks[day],
            [key]: value,
          },
        };
      });
    };
  }

  return (
    <main className="flex flex-col items-stretch gap-4 py-4">
      <h1 className="text-3xl font-bold">Create your tasks</h1>
      <section className="flex flex-col gap-8">
        <section className="flex flex-wrap gap-4">
          <Select
            className="flex flex-col grow gap-1"
            label="Select the month:"
            value={month}
            onChange={handleMonthChange}
          >
            {monthsOfTheYear.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>
          <Select
            className="flex flex-col grow gap-1"
            label="Select the year:"
            value={year}
            onChange={handleYearChange}
          >
            {Array(new Date().getFullYear() + 2)
              .fill(null)
              .map((_, index, array) => {
                const value = array.length - index - 1;
                return (
                  <option key={index} value={value}>
                    {value}
                  </option>
                );
              })}
          </Select>
        </section>
        <TasksForTheMonth
          className="flex flex-col items-stretch gap-4"
          ref={tasksForTheMonthRef}
          month={month}
          tasks={tasks}
          year={year}
          onDayTaskColorChange={handleDayTaskChange(`color`)}
          onDayTaskTextChange={handleDayTaskChange(`text`)}
        />
        <button
          className="bg-slate-100 text-slate-800 p-4 rounded-full shadow-md hover:shadow-lg"
          type="button"
          onClick={printTasksForTheMonth}
        >
          Print
        </button>
      </section>
    </main>
  );
}
