import { useState } from "react";

function Tabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="tab-list" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={active === index}
            className={active === index ? "tab active" : "tab"}
            onClick={() => setActive(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p role="tabpanel">{tabs[active].content}</p>
    </div>
  );
}

export default Tabs;
