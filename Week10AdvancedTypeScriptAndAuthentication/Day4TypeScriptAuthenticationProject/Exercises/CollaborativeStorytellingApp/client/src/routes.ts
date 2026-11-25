export type Route =
  | { page: "all" | "mine" | "new" | "login" | "register" | "not-found" }
  | { page: "detail" | "edit"; storyId: number };

/** Keep route parsing independent of React so deep links are easy to verify. */
export function parseRoute(location: string): Route {
  const path = location.split("?")[0].replace(/\/+$/, "") || "/";
  const pages: Record<string, Route["page"]> = {
    "/": "all",
    "/stories": "all",
    "/stories/mine": "mine",
    "/stories/new": "new",
    "/login": "login",
    "/register": "register",
  };
  if (pages[path]) return { page: pages[path] } as Route;
  const match = /^\/stories\/([1-9]\d*)(\/edit)?$/.exec(path);
  if (match && Number.isSafeInteger(Number(match[1]))) {
    return { page: match[2] ? "edit" : "detail", storyId: Number(match[1]) };
  }
  return { page: "not-found" };
}

/** A login return URL may target only a known local story page. */
export function safeReturnTo(candidate: string | null): string {
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    /[\\\r\n]/.test(candidate)
  )
    return "/stories";
  const route = parseRoute(candidate);
  return ["login", "register", "not-found"].includes(route.page) ? "/stories" : candidate;
}
