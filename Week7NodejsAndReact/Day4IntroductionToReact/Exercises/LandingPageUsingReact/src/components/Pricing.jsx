const plans = [
  { name: "Free", price: 0, perks: ["50 notes", "3 tags"] },
  {
    name: "Student",
    price: 9,
    perks: ["Unlimited notes", "Unlimited tags", "Review mode"],
    highlight: true,
  },
  { name: "Class", price: 29, perks: ["Everything in Student", "Shared class notebooks"] },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <h2>Pricing</h2>
      <div className="grid">
        {plans.map(plan => (
          <article key={plan.name} className={plan.highlight ? "card highlight" : "card"}>
            <h3>{plan.name}</h3>
            <p className="price">{plan.price === 0 ? "Free" : `₪${plan.price}/month`}</p>
            <ul>
              {plan.perks.map(perk => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
