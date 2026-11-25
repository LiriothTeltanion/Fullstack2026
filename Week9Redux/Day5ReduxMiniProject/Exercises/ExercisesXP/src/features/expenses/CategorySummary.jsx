import { useSelector } from "react-redux";
import { selectTotalsByCategory } from "./expensesSlice.js";

export default function CategorySummary() {
  const rows = useSelector(selectTotalsByCategory);

  return (
    <section className="card">
      <h2>By category</h2>
      <table>
        <tbody>
          {rows.map(row => (
            <tr key={row.category}>
              <td>{row.category}</td>
              <td style={{ textAlign: "right", paddingLeft: 24 }}>₪{row.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
