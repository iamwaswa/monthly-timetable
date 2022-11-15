import type { Dispatch, SetStateAction } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { DayTasks } from "~/types";
import { isValidBrowserStorageItem, createDayTasks } from "~/utils";

export function useTasks(): [DayTasks, Dispatch<SetStateAction<DayTasks>>] {
  const [tasks, setTasks] = useState<DayTasks>(createDayTasks());

  const updatedFromLocalStorage = useRef<boolean>(false);

  useLayoutEffect(() => {
    const storedItem = localStorage.getItem(`tasks`);
    updatedFromLocalStorage.current = true;
    if (storedItem) {
      const parsedStoredItem = JSON.parse(storedItem);
      if (isValidBrowserStorageItem(parsedStoredItem)) {
        setTasks(parsedStoredItem);
      }
    }
  }, []);

  useEffect(() => {
    if (updatedFromLocalStorage.current) {
      updatedFromLocalStorage.current = false;
      return;
    }

    localStorage.setItem(`tasks`, JSON.stringify(tasks));
  }, [tasks]);

  return [tasks, setTasks];
}
