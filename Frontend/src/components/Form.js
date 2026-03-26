import { useState } from "react";

export default function Form({ onSubmit }) {
  const [form, setForm] = useState({
    step: 1,
    type: "TRANSFER",
    amount: 1000,
    oldbalanceOrg: 1000,
    newbalanceOrig: 0,
    oldbalanceDest: 0,
    newbalanceDest: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "type" ? value : Number(value),
    });
  };

  return (
    <div className="card">
      <h2>Transaction Input</h2>

      <div className="grid">

        <input
          name="step"
          type="number"
          placeholder="Step (1–744)"
          value={form.step}
          onChange={handleChange}
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="TRANSFER">TRANSFER</option>
          <option value="CASH_OUT">CASH_OUT</option>
        </select>

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />

        <input
          name="oldbalanceOrg"
          type="number"
          placeholder="Sender Old Balance"
          value={form.oldbalanceOrg}
          onChange={handleChange}
        />

        <input
          name="newbalanceOrig"
          type="number"
          placeholder="Sender New Balance"
          value={form.newbalanceOrig}
          onChange={handleChange}
        />

        <input
          name="oldbalanceDest"
          type="number"
          placeholder="Receiver Old Balance"
          value={form.oldbalanceDest}
          onChange={handleChange}
        />

        <input
          name="newbalanceDest"
          type="number"
          placeholder="Receiver New Balance"
          value={form.newbalanceDest}
          onChange={handleChange}
        />

      </div>

      <button onClick={() => onSubmit(form)}>
        🔍 Predict Fraud
      </button>
    </div>
  );
}