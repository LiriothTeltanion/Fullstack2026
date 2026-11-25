import { useState } from "react";
import Panel from "./Panel.jsx";

const panels = [
  { title: "What is a component?", text: "A function that returns JSX." },
  { title: "What are props?", text: "Values a parent passes to a child." },
  { title: "What is state?", text: "Data a component remembers between renders." },
];

function Accordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      {panels.map((panel, index) => (
        <Panel
          key={panel.title}
          title={panel.title}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
        >
          {panel.text}
        </Panel>
      ))}
    </div>
  );
}

export default Accordion;
