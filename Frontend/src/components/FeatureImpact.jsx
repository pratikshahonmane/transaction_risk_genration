import React from 'react';
import './FeatureImpact.css';

const FeatureImpact = ({ formData }) => {
  const features = [
    { name: 'Step', value: Number(formData.step || 0) },
    { name: 'Amount', value: Number(formData.amount || 0) },
    { name: 'Receiver New Balance', value: Number(formData.newbalanceDest || 0) },
    { name: 'Receiver Old Balance', value: Number(formData.oldbalanceDest || 0) },
    { name: 'Sender New Balance', value: Number(formData.newbalanceOrig || 0) },
    { name: 'Sender Old Balance', value: Number(formData.oldbalanceOrg || 0) },
    { name: 'Transaction Type', value: formData.type === 'CASH_OUT' ? 1 : 0.5 }
  ];

  const maxVal = Math.max(...features.map((f) => f.value), 1);

  const scored = features
    .map((feature) => ({
      ...feature,
      impact: feature.value / maxVal
    }))
    .sort((a, b) => b.impact - a.impact);

  return (
    <div className="feature-impact">
      <div className="impact-title">🚨 Feature Impact Analysis</div>
      {scored.map((feature, index) => (
        <div className="impact-item" key={feature.name}>
          <div className="impact-row">
            <span className={`impact-name ${index === 0 ? 'top-feature' : ''}`}>
              {index === 0 ? '🔥 ' : ''}
              {feature.name}
            </span>
            <span className="impact-value">{(feature.impact * 100).toFixed(0)}%</span>
          </div>
          <div className="impact-bar">
            <div
              className="impact-fill"
              style={{
                width: `${feature.impact * 100}%`,
                background:
                  index === 0
                    ? 'linear-gradient(90deg, #ff4d4d, #ff0000)'
                    : 'linear-gradient(90deg, #ff7a18, #ffb347)'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureImpact;
