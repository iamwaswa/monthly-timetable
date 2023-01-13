import { MutableRefObject } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export function usePrint<TElement extends HTMLElement>(): [
  MutableRefObject<TElement | null>,
  () => void
] {
  const elementToPrintRef = useRef<TElement | null>(null);

  const reactToPrint = useReactToPrint({
    documentTitle: `Monthly Timetable`,
    pageStyle: `m-1`,
    content() {
      return elementToPrintRef.current;
    },
  });

  return [elementToPrintRef, reactToPrint];
}
