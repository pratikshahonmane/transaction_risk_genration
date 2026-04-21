import React from 'react';
import ExplanationList from './ExplanationList';
import FeatureImpact from './FeatureImpact';
import './RiskResultPanel.css';

const RiskResultPanel = ({ result, formData, getRiskColor, getDynamicExplanation }) => {
  const riskColor = getRiskColor();

  const verdictChipStyle = {
    background: result?.prediction === 'fraud' ? '#ff4d4d' : '#00ff88',
    boxShadow: `0 0 15px ${result?.prediction === 'fraud' ? '#ff4d4d' : '#00ff88'}66`
  };

  return (
    <div className="glass-card result-panel">
      {result ? (
        <>
          <div className="risk-circle" style={{ borderColor: riskColor, boxShadow: `0 0 20px ${riskColor}33` }}>
            <div className="risk-value">{result.score}%</div>
            <div className="risk-label">RISK</div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div className="prediction-chip" style={verdictChipStyle}>
              {result.prediction === 'fraud' ? '🚩 Fraud Detected' : '✅ Safe Transaction'}
            </div>

            <h3 className="risk-level" style={{ color: riskColor }}>
              {result.level} RISK
            </h3>

            <div className="confidence-panel">
              <div className="confidence-title">
                🧠 AI Confidence:{' '}
                {result?.confidence !== undefined
                  ? `${(result.confidence * 100).toFixed(1)}%`
                  : 'N/A'}
              </div>
              <div className="progress-container">
                <div
                  className="progress-fill"
                  style={{ width: result?.confidence ? `${result.confidence * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          <hr className="result-divider" />

          <ExplanationList
            explanationPoints={getDynamicExplanation(result.score)}
            aiExplanation={result.explanation}
          />

          <FeatureImpact formData={formData} />

          <div className="recommendation-box" style={{ background: `${riskColor}15`, borderColor: `${riskColor}55` }}>
            <strong>Recommendation:</strong>{' '}
            {result.score > 70
              ? 'Block immediately'
              : result.score > 30
              ? 'Flag for review'
              : 'Approve transaction'}
          </div>
        </>
      ) : (
        <div className="empty-result">
          <div className="empty-icon">🔍</div>
          <p>Awaiting transaction data...</p>
        </div>
      )}
    </div>
  );
};

export default RiskResultPanel;
