import { Container, parseResponse, Repository, type Response } from "./genericCollections.ts";

type Named = { name: string };
type Identified = { id: number };
const members = new Container<Named & Identified>();
const member = { name: "Example", id: 1 };
members.add(member);
console.log(members.list(), members.remove(member));

const decoded: Response<Named> = { data: { name: "Example" }, status: 200 };
console.log(parseResponse<Named>(decoded).name);

const names = new Repository<string>();
names.add("Example");
console.log(names.retrieve(0), names.list());

// This uncalled function verifies compile-time contracts without changing the demo.
function typeErrorExamples(): void {
  // @ts-expect-error An intersection requires both the name and identifier.
  members.add({ name: "Missing identifier" });
  // @ts-expect-error This repository stores strings only.
  names.add(42);
  // @ts-expect-error A response must include its numeric status.
  const invalid: Response<string> = { data: "Missing status" };
  void invalid;
}
void typeErrorExamples;
