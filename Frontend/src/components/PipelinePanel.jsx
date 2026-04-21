import React from 'react';
import './PipelinePanel.css';

const PipelinePanel = ({ steps, activeStep }) => (
  <div className="glass-card">
    <h5 className="panel-heading">Processing Pipeline</h5>
    <div className="pipeline-panel">
      {steps.map((step, index) => (
        <div className="pipeline-row" key={step.title}>
          {index !== steps.length - 1 && (
            <span className={`pipeline-connector ${activeStep >= index ? 'active' : ''}`} />
          )}
          <div className={`pipeline-step ${activeStep === index ? 'step-active' : ''}`}>
            <div className="pipeline-step-icon">{step.icon}</div>
            <div className="pipeline-step-content">
              <div className="pipeline-step-title">{step.title}</div>
              <div className="pipeline-step-desc">{step.desc}</div>
            </div>
            <div className={`pipeline-status-indicator ${
              activeStep > index ? 'complete' : activeStep === index ? 'active' : 'idle'
            }`} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PipelinePanel;
