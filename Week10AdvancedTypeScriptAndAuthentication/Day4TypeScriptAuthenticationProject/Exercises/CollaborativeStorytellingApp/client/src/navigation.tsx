import { useSyncExternalStore, type AnchorHTMLAttributes } from "react";

const navigationEvent = "storytelling:navigate";
function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(navigationEvent, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(navigationEvent, listener);
  };
}
export function useLocation() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname + window.location.search,
    () => "/stories"
  );
}
export function navigate(path: string, options: { replace?: boolean } = {}) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\"))
    throw new Error("Expected a local application path.");
  window.history[options.replace ? "replaceState" : "pushState"]({}, "", path);
  window.dispatchEvent(new Event(navigationEvent));
}

/** Real anchors retain keyboard, open-in-new-tab and copy-link behavior. */
export function AppLink({
  href,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      {...props}
      href={href}
      onClick={event => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target ||
          props.download !== undefined
        )
          return;
        const target = new URL(href, window.location.href);
        if (target.origin !== window.location.origin || href.startsWith("#")) return;
        event.preventDefault();
        navigate(target.pathname + target.search + target.hash);
      }}
    />
  );
}
