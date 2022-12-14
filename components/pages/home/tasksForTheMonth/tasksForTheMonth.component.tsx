import type { ChangeEvent } from "react";
import { forwardRef, useMemo } from "react";

import { daysOfTheWeek } from "~/constants";
import type { MonthOfTheYear, DayTasks, DayOfTheWeek } from "~/types";

import { createDaysOfTheMonth } from "./tasksForTheMonth.utils";

interface ITasksForTheMonthProps {
  className: string;
  month: MonthOfTheYear;
  tasks: DayTasks;
  year: number;
  onDayTaskColorChange(day: DayOfTheWeek, value: string): void;
  onDayTaskTextChange(day: DayOfTheWeek, value: string): void;
}

export const TasksForTheMonth = forwardRef<
  HTMLDivElement,
  ITasksForTheMonthProps
>(function TasksForTheMonth(
  { className, tasks, month, year, onDayTaskColorChange, onDayTaskTextChange },
  ref
) {
  const daysOfTheMonth = useMemo(
    () => createDaysOfTheMonth(month, year),
    [month, year]
  );

  function handleColorChange(day: DayOfTheWeek) {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      onDayTaskColorChange(day, event.target.value);
    };
  }

  function handleTextChange(day: DayOfTheWeek) {
    return (event: ChangeEvent<HTMLTextAreaElement>): void => {
      onDayTaskTextChange(day, event.target.value);
    };
  }

  return (
    <section className={className}>
      <section className="flex flex-col gap-4" ref={ref}>
        <h2 className="text-3xl text-center font-medium">
          {month} {year}
        </h2>
        <section>
          <section className="grid grid-cols-7">
            {daysOfTheWeek.map((day) => (
              <span
                key={day}
                className="flex justify-between gap-2 border-neutral-900 border-y-2 border-r-2 first:border-l-2 grow font-normal p-2"
              >
                <span>{day}</span>
                <input
                  type="color"
                  value={tasks[day].color}
                  onChange={handleColorChange(day)}
                />
              </span>
            ))}
          </section>
          <section className="flex flex-col">
            {daysOfTheMonth.map((week, weekIndex) => {
              return (
                <section
                  key={weekIndex}
                  className="grid grid-cols-7 grid-rows-[125px]"
                >
                  {week.map((dayOfTheMonth, dayIndex) => {
                    const day = daysOfTheWeek[dayIndex];
                    return (
                      <span
                        key={day}
                        className="flex flex-col gap-1 border-neutral-900 border-b-2 border-r-2 first:border-l-2 grow p-1 font-normal text-xs break-all"
                      >
                        {dayOfTheMonth ? (
                          <>
                            <span>{dayOfTheMonth}</span>
                            <textarea
                              className="border-none resize-none text-xs focus-visible:outline-none"
                              cols={17}
                              rows={6}
                              style={{ color: tasks[day].color }}
                              value={tasks[day].text}
                              onChange={handleTextChange(day)}
                            />
                            <span className="hidden flex-col">
                              {tasks[day].text
                                .split(`\n`)
                                .map((task, index) => {
                                  return (
                                    <span
                                      key={index}
                                      style={{ color: tasks[day].color }}
                                    >
                                      {task}
                                    </span>
                                  );
                                })}
                            </span>
                          </>
                        ) : null}
                      </span>
                    );
                  })}
                </section>
              );
            })}
          </section>
        </section>
      </section>
    </section>
  );
});

TasksForTheMonth.displayName = `forwardRef(TasksForTheMonth)`;
