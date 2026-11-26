import axios from "axios";
import { faker } from "@faker-js/faker";
import { addDays, format } from "date-fns";

export async function postTitles(client = axios) {
  const { data } = await client.get("https://jsonplaceholder.typicode.com/posts", {
    timeout: 8000,
    responseType: "json",
  });
  if (!Array.isArray(data) || !data.every(post => typeof post?.title === "string")) {
    throw new Error("The post service returned an unexpected response.");
  }
  return data.map(post => post.title);
}

export function datePair(today = new Date()) {
  const pattern = "yyyy-MM-dd";
  return { today: format(today, pattern), inFiveDays: format(addDays(today, 5), pattern) };
}

export function sampleUsers(count = 3) {
  if (!Number.isSafeInteger(count) || count < 1 || count > 100) {
    throw new RangeError("Choose a whole number of users from 1 to 100.");
  }
  return Array.from({ length: count }, (_, index) => ({
    name: faker.person.fullName(),
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    // Keep generated contact addresses in the reserved testing domain.
    email: `listener${index + 1}@example.test`,
  }));
}

export const digitsIn = text => (text.match(/[0-9]/g) ?? []).join("");

// This exercise accepts two capitalized words or words in an uncased script.
// It is a practice pattern, not a general validator for people's real names.
const namePart = "[\\p{Lu}\\p{Lt}\\p{Lo}][\\p{L}\\p{M}]*(?:[-'’][\\p{L}][\\p{L}\\p{M}]*)*";
const twoNames = new RegExp(`^${namePart} ${namePart}$`, "u");
export const isPracticeFullName = text =>
  twoNames.test(text.normalize("NFC")) && !/[\r\n]/.test(text);
