import { MutableRefObject, useId } from "react";
import { useCallback, useRef } from "react";

export function usePrint<TElement extends HTMLElement>(
  bodyClass?: string
): [MutableRefObject<TElement | null>, () => void] {
  const printWindowId = useId();

  const elementToPrintRef = useRef<TElement | null>(null);

  const createPrintWindowIframe = useCallback(() => {
    const iframe = document.createElement(`iframe`);
    iframe.style.position = `absolute`;
    iframe.style.top = `-1000px`;
    iframe.style.left = `-1000px`;
    iframe.id = printWindowId;
    // Ensure we set a DOCTYPE on the iframe's document
    // https://github.com/gregnb/react-to-print/issues/459
    iframe.srcdoc = `<!DOCTYPE html>`;

    return iframe;
  }, []);

  const deleteColorInputs = useCallback((printWindowDocument: Document) => {
    Array.from(
      printWindowDocument.querySelectorAll(`input[type="color"]`)
    ).forEach((colorInput) => {
      colorInput.remove();
    });
  }, []);

  const addClassesToPrintWindowBody = useCallback(
    (classes: string | undefined, printWindowDocument: Document) => {
      if (classes) {
        printWindowDocument.body.classList.add(...(classes ?? ``).split(` `));
      }
    },
    []
  );

  const handlePrint = useCallback((printWindow: HTMLIFrameElement) => {
    if (printWindow.contentWindow) {
      printWindow.contentWindow.print();
    } else {
      throw new Error(`Print window missing the content window`);
    }
  }, []);

  const addStylesToPrintWindowAsync = useCallback(
    async (printWindowDocument: Document) => {
      return new Promise<void>((resolve) => {
        const headStyleElement = document.querySelector(`style`);

        if (headStyleElement) {
          const newStyleElement = printWindowDocument.createElement(
            headStyleElement.tagName
          );

          if (headStyleElement.sheet) {
            const styleCSS = [];

            for (const cssRule of Array.from(headStyleElement.sheet.cssRules)) {
              styleCSS.push(cssRule.cssText);
            }

            newStyleElement.appendChild(
              printWindowDocument.createTextNode(styleCSS.join(`\n`))
            );

            printWindowDocument.head.appendChild(newStyleElement);
          }
        }

        const linkElement = document.querySelector(`link[rel="stylesheet"]`);

        if (linkElement) {
          const newHeadLinkElement = printWindowDocument.createElement(
            linkElement.tagName
          );

          for (const attribute of Array.from(linkElement.attributes)) {
            newHeadLinkElement.setAttribute(
              attribute.nodeName,
              attribute.nodeValue || ``
            );
          }

          newHeadLinkElement.onerror = () => {
            resolve();
          };

          newHeadLinkElement.onload = () => {
            resolve();
          };

          printWindowDocument.head.appendChild(newHeadLinkElement);
        } else {
          resolve();
        }
      });
    },
    []
  );

  const print = useCallback(() => {
    const printWindowIframe = createPrintWindowIframe();

    if (elementToPrintRef.current) {
      const content = elementToPrintRef.current;

      printWindowIframe.onload = async () => {
        const printWindowDocument =
          printWindowIframe.contentDocument ??
          printWindowIframe.contentWindow?.document;

        if (printWindowDocument) {
          printWindowDocument.body.appendChild(content.cloneNode(true));

          deleteColorInputs(printWindowDocument);

          addClassesToPrintWindowBody(bodyClass, printWindowDocument);

          await addStylesToPrintWindowAsync(printWindowDocument);

          handlePrint(printWindowIframe);
        }
      };

      document.body.appendChild(printWindowIframe);
    } else {
      throw new Error(`Element to print is not set`);
    }
  }, [
    bodyClass,
    addClassesToPrintWindowBody,
    addStylesToPrintWindowAsync,
    createPrintWindowIframe,
    handlePrint,
  ]);

  return [elementToPrintRef, print];
}
