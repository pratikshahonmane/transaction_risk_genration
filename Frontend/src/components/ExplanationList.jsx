import React from 'react';
import './ExplanationList.css';

const ExplanationList = ({ explanationPoints, aiExplanation }) => (
  <div className="explanation-list">
    <div className="explanation-title">💡 Explainable AI - Risk Factors Detected:</div>
    {explanationPoints.map((point, index) => (
      <div className="explanation-item" key={index}>
        <div className="explanation-icon">✓</div>
        <div className="explanation-text">{point}</div>
      </div>
    ))}

    {aiExplanation && aiExplanation.length > 0 && (
      <>
        <div className="ai-reason-title">AI Reasoning:</div>
        {aiExplanation.map((line, index) => (
          <div className="explanation-item reason-item" key={index}>
            <div className="explanation-icon">✓</div>
            <div className="explanation-text">{line}</div>
          </div>
        ))}
      </>
    )}
  </div>
);

export default ExplanationList;
