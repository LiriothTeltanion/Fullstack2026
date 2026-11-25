// Exercise 1: typed props, with one optional prop.
interface GreetingProps {
  name: string;
  age?: number;
}

export default function Greeting({ name, age }: GreetingProps) {
  return (
    <p>
      Hello, {name}
      {age !== undefined && ` (${age} years old)`}.
    </p>
  );
}
