import fetch from "isomorphic-fetch";

import type { ChangeEvent } from "react";

import { monthsOfTheYear } from "~/constants";
import type { DayOfTheWeek, Task } from "~/types";
import { base64StringToUint8Array } from "~/utils";

import { useMonth } from "./month.hook";
import { usePrint } from "./print.hook";
import { useRegisterServiceWorker } from "./registerServiceWorker.hook";
import { useTasks } from "./tasks.hook";
import { useYear } from "./year.hook";

import { Select } from "./select";
import { TasksForTheMonth } from "./tasksForTheMonth";

export function HomePage() {
  useRegisterServiceWorker();

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

  async function handlePrintAsync() {
    return Promise.all([
      new Promise<void>(async (resolve) => {
        let permission = Notification.permission;

        if (permission === `default`) {
          permission = await Notification.requestPermission();
        }

        if (permission === `granted`) {
          const registration = await navigator.serviceWorker.getRegistration();

          if (registration) {
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
              subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: base64StringToUint8Array(
                  `BJhWo57CxcG__TeF4Nz_IsvpezZ6nXrPjnq7tRmINtHuUsccqm0Mz2snHA3fhPaxTssYA26FIBo5NWRrWZfzXNA`
                ),
              });

              fetch(`/api/add-subscription`, {
                method: `POST`,
                headers: {
                  [`Content-Type`]: `application/json`,
                },
                body: JSON.stringify(subscription),
              });
            }
          }
        }

        resolve();
      }),
      new Promise<void>((resolve) => {
        printTasksForTheMonth();
        resolve();
      }),
    ]);
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
          onClick={handlePrintAsync}
        >
          Print
        </button>
      </section>
    </main>
  );
}
