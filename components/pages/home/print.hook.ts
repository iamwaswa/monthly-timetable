import { MutableRefObject, useId } from "react";
import { useCallback, useRef } from "react";

export function usePrint<TElement extends HTMLElement>(): [
  MutableRefObject<TElement | null>,
  () => void
] {
  const printWindowId = useId();

  const elementToPrintRef = useRef<TElement | null>(null);

  const print = useCallback(() => {
    const printWindowIframe = createPrintWindowIframe(printWindowId);

    if (elementToPrintRef.current) {
      const content = elementToPrintRef.current;

      printWindowIframe.onload = async () => {
        const printWindowDocument =
          printWindowIframe.contentDocument ??
          printWindowIframe.contentWindow?.document;

        if (printWindowDocument) {
          printWindowDocument.body.appendChild(content.cloneNode(true));

          deleteColorInputs(printWindowDocument);

          await addStylesToPrintWindowAsync(printWindowDocument);

          handlePrint(printWindowIframe);
        }
      };

      document.body.appendChild(printWindowIframe);
    } else {
      throw new Error(`Element to print is not set`);
    }
  }, [printWindowId]);

  return [elementToPrintRef, print];
}

function createPrintWindowIframe(id: string) {
  const iframe = document.createElement(`iframe`);
  iframe.style.position = `absolute`;
  iframe.style.top = `-1000px`;
  iframe.style.left = `-1000px`;
  iframe.id = id;

  // Ensure we set a DOCTYPE on the iframe's document
  // https://github.com/gregnb/react-to-print/issues/459
  iframe.srcdoc = `<!DOCTYPE html>`;

  return iframe;
}

function deleteColorInputs(printWindowDocument: Document) {
  Array.from(
    printWindowDocument.querySelectorAll(`input[type="color"]`)
  ).forEach((colorInput) => {
    colorInput.remove();
  });
}

async function addStylesToPrintWindowAsync(printWindowDocument: Document) {
  return new Promise<void>((resolve) => {
    // In development mode the very first style tag should be in the document head.
    // This style tag contains all the tailwind css classes
    // that will be necessary to load in the window to print
    const styleElement = document.querySelector(`style`);
    if (styleElement) {
      if (styleElement.sheet) {
        const styleCSS = Array.from(styleElement.sheet.cssRules).map(
          ({ cssText }) => cssText
        );

        const newStyleElement = printWindowDocument.createElement(
          styleElement.tagName
        );

        newStyleElement.appendChild(
          printWindowDocument.createTextNode(styleCSS.join(`\n`))
        );

        printWindowDocument.head.appendChild(newStyleElement);
      }
    }

    // In production mode the very first stylesheet link should be in the document head.
    // This stylesheet link points to the css file that contains all the tailwind css classes
    // that will be necessary to load in the window to print
    const linkElement = document.querySelector(`link[rel="stylesheet"]`);
    if (linkElement) {
      const newLinkElement = printWindowDocument.createElement(
        linkElement.tagName
      );

      for (const attribute of Array.from(linkElement.attributes)) {
        newLinkElement.setAttribute(
          attribute.nodeName,
          attribute.nodeValue || ``
        );
      }

      newLinkElement.onerror = () => {
        resolve();
      };

      newLinkElement.onload = () => {
        resolve();
      };

      printWindowDocument.head.appendChild(newLinkElement);
    } else {
      resolve();
    }
  });
}

function handlePrint(printWindow: HTMLIFrameElement) {
  if (printWindow.contentWindow) {
    // Override the title of the document
    // Print filename in Chrome
    printWindow.ownerDocument.title = ``;

    // Print filename in Firefox, Safari
    if (printWindow.contentDocument) {
      printWindow.contentDocument.title = ``;
    }

    // Add page styles
    const pageStyleElement = document.createElement(`style`);
    pageStyleElement.setAttribute(`media`, `print`);
    pageStyleElement.setAttribute(`type`, `text/css`);
    pageStyleElement.innerHTML = `
      @page {
        margin: 2rem 1rem 1rem 1rem;
        size: landscape;
      }
    `;
    printWindow.contentDocument?.head.appendChild(pageStyleElement);

    printWindow.contentWindow.print();
  } else {
    throw new Error(`Print window missing the content window`);
  }
}
