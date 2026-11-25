import { useState } from "react";
import DataTable, { type Column } from "./components/DataTable";
import Select from "./components/Select";
import rawCountries from "./data/countries.json?raw";
import { parseCountries, type Country } from "./data/guards";

const { valid: countries, rejected } = parseCountries(rawCountries);

const columns: Column<Country>[] = [
  { key: "code", header: "Code" },
  { key: "name", header: "Country" },
  { key: "continent", header: "Continent" },
  {
    key: "population",
    header: "Population",
    render: row => row.population.toLocaleString("en-US"),
  },
];

type ContinentFilter = Country["continent"] | "All";
const FILTERS: ContinentFilter[] = ["All", "Asia", "Europe", "Americas", "Africa", "Oceania"];

export default function App() {
  const [continent, setContinent] = useState<ContinentFilter>("All");
  const rows =
    continent === "All" ? countries : countries.filter(country => country.continent === continent);

  return (
    <main>
      <h1>Generic components</h1>
      <section className="card">
        <Select
          label="Continent:"
          options={FILTERS}
          value={continent}
          onChange={setContinent}
          getLabel={option => option}
        />
        <p className="muted">
          {countries.length} rows passed the type guard, {rejected} rejected. Click a header to
          sort.
        </p>
        <DataTable rows={rows} columns={columns} getRowId={row => row.code} />
      </section>
    </main>
  );
}
