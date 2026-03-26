import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";

export default function Charts({ data }) {

  const fraudData = [
    { name: "Fraud", value: data.filter(d => d.prediction === "fraud").length },
    { name: "Legit", value: data.filter(d => d.prediction === "legitimate").length }
  ];

  const riskData = [
    { name: "Low", value: data.filter(d => d.risk_level === "low").length },
    { name: "Medium", value: data.filter(d => d.risk_level === "medium").length },
    { name: "High", value: data.filter(d => d.risk_level === "high").length },
    { name: "Critical", value: data.filter(d => d.risk_level === "critical").length }
  ];

  return (
    <div className="charts">

      <div className="card">
        <h3>Fraud vs Legit</h3>
        <PieChart width={300} height={250}>
          <Pie data={fraudData} dataKey="value" outerRadius={80}>
            {fraudData.map((_, i) => <Cell key={i} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="card">
        <h3>Risk Distribution</h3>
        <BarChart width={300} height={250} data={riskData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

    </div>
  );
}