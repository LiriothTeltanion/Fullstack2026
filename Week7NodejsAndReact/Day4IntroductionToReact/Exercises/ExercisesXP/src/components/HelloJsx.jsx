// Exercise 1: a JSX element stored in a variable and a JS expression inside { }.
const myElement = <h1>I Love JSX!</h1>;
const sum = 5 + 5;

export default function HelloJsx() {
  return (
    <>
      <p>Hello World!</p>
      {myElement}
      <p>React is {sum} times better with JSX</p>
    </>
  );
}
