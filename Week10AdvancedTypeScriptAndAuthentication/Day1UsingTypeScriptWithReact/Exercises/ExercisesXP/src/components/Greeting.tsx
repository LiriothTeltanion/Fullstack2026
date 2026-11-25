// Exercise 1: typed props, with one optional prop.
interface GreetingProps {
  name: string;
  messageCount: number;
  age?: number;
}

export default function Greeting({ name, messageCount, age }: GreetingProps) {
  return (
    <p>
      Hello, {name}
      {age !== undefined && ` (${age} years old)`}. You have {messageCount} unread{" "}
      {messageCount === 1 ? "message" : "messages"}.
    </p>
  );
}
