import Charts from "./Charts";

export default function Dashboard({ data }) {
  const total = data.length;
  const fraud = data.filter(d => d.prediction === "fraud").length;

  return (
    <div>
      <div className="stats">
        <div className="card stat">
          <h3>Total</h3>
          <p>{total}</p>
        </div>

        <div className="card stat">
          <h3>Fraud</h3>
          <p>{fraud}</p>
        </div>

        <div className="card stat">
          <h3>Rate</h3>
          <p>{total ? ((fraud/total)*100).toFixed(2) : 0}%</p>
        </div>
      </div>

      <Charts data={data} />
    </div>
  );
}