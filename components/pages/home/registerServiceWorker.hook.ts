import { useEffect } from "react";

export function useRegisterServiceWorker() {
  useEffect(() => {
    if (`serviceWorker` in navigator && `PushManager` in window) {
      navigator.serviceWorker.register(`./serviceWorker.js`);
    }
  }, []);
}
