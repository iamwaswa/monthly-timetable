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

  const addStylesToPrintWindow = useCallback(
    (printWindowDocument: Document, printWindowIframe: HTMLIFrameElement) => {
      Array.from(document.querySelectorAll(`style`))
        .filter((styleElement) => {
          return styleElement.parentNode?.nodeName.toLowerCase() === `head`;
        })
        .forEach((headStyleElement) => {
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
        });

      const linkElements = Array.from(
        document.querySelectorAll(`link[rel="stylesheet"]`)
      ).filter((linkElement) => {
        return (
          linkElement.parentNode?.nodeName.toLowerCase() === `head` &&
          linkElement.getAttribute(`href`) &&
          !linkElement.hasAttribute(`disabled`)
        );
      });

      let linkElementsCount = linkElements.length;

      linkElements.forEach((linkElement) => {
        const newHeadLinkElement = printWindowDocument.createElement(
          linkElement.tagName
        );

        for (const attribute of Array.from(newHeadLinkElement.attributes)) {
          newHeadLinkElement.setAttribute(
            attribute.nodeName,
            attribute.nodeValue || ``
          );
        }

        newHeadLinkElement.onload = decreateLinkElementsCount;

        newHeadLinkElement.onerror = decreateLinkElementsCount;

        printWindowDocument.head.appendChild(newHeadLinkElement);

        function decreateLinkElementsCount() {
          linkElementsCount--;

          if (linkElementsCount === 0) {
            handlePrint(printWindowIframe);
          }
        }
      });
    },
    [handlePrint]
  );

  const print = useCallback(() => {
    const printWindowIframe = createPrintWindowIframe();

    if (elementToPrintRef.current) {
      const content = elementToPrintRef.current;

      printWindowIframe.onload = () => {
        const printWindowDocument =
          printWindowIframe.contentDocument ??
          printWindowIframe.contentWindow?.document;

        if (printWindowDocument) {
          printWindowDocument.body.appendChild(content.cloneNode(true));

          deleteColorInputs(printWindowDocument);

          addClassesToPrintWindowBody(bodyClass, printWindowDocument);

          addStylesToPrintWindow(printWindowDocument, printWindowIframe);
        }
      };

      document.body.appendChild(printWindowIframe);
    } else {
      throw new Error(`Element to print is not set`);
    }
  }, [
    bodyClass,
    addClassesToPrintWindowBody,
    addStylesToPrintWindow,
    createPrintWindowIframe,
  ]);

  return [elementToPrintRef, print];
}
