export default function Result({ data }) {
  if (!data) return null;

  const isFraud = data.prediction === "fraud";

  return (
    <div className={`card result ${isFraud ? "fraud" : "legit"}`}>
      <h2>🔎 Latest Prediction</h2>

      <div className="result-grid">
        <div>
          <p>Status</p>
          <h3>{data.prediction}</h3>
        </div>

        <div>
          <p>Probability</p>
          <h3>{(data.fraud_probability * 100).toFixed(2)}%</h3>
        </div>

        <div>
          <p>Risk</p>
          <h3>{data.risk_level}</h3>
        </div>

        <div>
          <p>Confidence</p>
          <h3>{(data.confidence * 100).toFixed(2)}%</h3>
        </div>
      </div>
    </div>
  );
}