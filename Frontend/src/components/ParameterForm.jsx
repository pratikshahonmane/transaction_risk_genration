import React from 'react';
import './ParameterForm.css';

const ParameterForm = ({ formData, setFormData, onAnalyze, loading }) => {
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="glass-card">
      <h5 className="panel-heading">Parameters</h5>
      <div className="parameter-form">
        <div className="form-row">
          <div className="form-group">
            <label>Step (Hour)</label>
            <input
              type="number"
              className="cyber-input"
              placeholder="1"
              value={formData.step}
              onChange={(e) => updateField('step', e.target.value)}
            />
          </div>
          <div className="form-group wide">
            <label>Amount (USD)</label>
            <input
              type="number"
              className="cyber-input"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => updateField('amount', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Sender Old Bal</label>
            <input
              type="number"
              className="cyber-input"
              value={formData.oldbalanceOrg}
              onChange={(e) => updateField('oldbalanceOrg', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Sender New Bal</label>
            <input
              type="number"
              className="cyber-input"
              value={formData.newbalanceOrig}
              onChange={(e) => updateField('newbalanceOrig', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Receiver Old Bal</label>
            <input
              type="number"
              className="cyber-input"
              value={formData.oldbalanceDest}
              onChange={(e) => updateField('oldbalanceDest', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Receiver New Bal</label>
            <input
              type="number"
              className="cyber-input"
              value={formData.newbalanceDest}
              onChange={(e) => updateField('newbalanceDest', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row single">
          <div className="form-group">
            <label>Transaction Type</label>
            <select
              className="cyber-input"
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
            >
              <option value="TRANSFER">Transfer</option>
              <option value="CASH_OUT">Cash Out</option>
            </select>
          </div>
        </div>

        <button className="btn-analyze" onClick={onAnalyze} disabled={loading}>
          {loading ? 'PROCESSING...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default ParameterForm;
