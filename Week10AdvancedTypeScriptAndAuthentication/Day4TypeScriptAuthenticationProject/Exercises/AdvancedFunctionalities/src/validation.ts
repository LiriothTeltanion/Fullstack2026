export interface CheckResult {
  ok: boolean;
  problems: string[];
}

export function checkPassword(password: string): CheckResult {
  const problems: string[] = [];
  if (password.length < 10) problems.push("at least 10 characters");
  if (!/[a-z]/i.test(password)) problems.push("at least one letter");
  if (!/\d/.test(password)) problems.push("at least one number");
  return { ok: problems.length === 0, problems };
}

export function checkUsername(username: string): CheckResult {
  const ok = /^[a-z0-9_]{3,20}$/i.test(username.trim());
  return { ok, problems: ok ? [] : ["3 to 20 letters, numbers or _"] };
}

export const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";
