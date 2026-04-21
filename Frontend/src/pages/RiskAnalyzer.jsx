import React, { useState } from 'react';
import axios from 'axios';
import ParameterForm from '../components/ParameterForm';
import PipelinePanel from '../components/PipelinePanel';
import RiskResultPanel from '../components/RiskResultPanel';
import '../App.css';
import './RiskAnalyzer.css';

const steps = [
  { title: 'Data Ingestion', desc: 'Receiving transaction data...', icon: '⬇️' },
  { title: 'Security Gateway', desc: 'Validating & authenticating...', icon: '🛡️' },
  { title: 'Data Processing', desc: 'Normalizing & extracting features...', icon: '⚙️' },
  { title: 'AI Risk Engine', desc: 'Analyzing risk patterns...', icon: '🧠' },
  { title: 'Result Generation', desc: 'Preparing explainable output...', icon: '✅' }
];

const defaultFormData = {
  amount: '',
  oldbalanceOrg: '',
  newbalanceOrig: '',
  oldbalanceDest: '',
  newbalanceDest: '',
  type: 'TRANSFER',
  step: '1'
};

const RiskAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleAnalyze = async () => {
    if (!formData.amount || !formData.oldbalanceOrg || !formData.step) {
      alert('Please enter the Step, Amount, and Sender Old Balance.');
      return;
    }

    setLoading(true);
    setResult(null);

    for (let i = 0; i < steps.length; i += 1) {
      setActiveStep(i);
      // Maintain the same animated pipeline behavior.
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    try {
      const payload = {
        step: Number(formData.step),
        type: formData.type,
        amount: Number(formData.amount),
        oldbalanceOrg: Number(formData.oldbalanceOrg),
        newbalanceOrig: formData.newbalanceOrig === '' ? 0 : Number(formData.newbalanceOrig),
        oldbalanceDest: formData.oldbalanceDest === '' ? 0 : Number(formData.oldbalanceDest),
        newbalanceDest: formData.newbalanceDest === '' ? 0 : Number(formData.newbalanceDest)
      };

      const response = await axios.post('http://localhost:8000/predict', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = response.data;

      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
        score: Math.round(data.fraud_probability * 100),
        level: data.risk_level?.toUpperCase(),
        explanation: data.explanation || []
      });
    } catch (error) {
      // Preserve the same fallback messaging as the original App.js logic.
      setResult({
        score: 0,
        level: 'ERROR',
        explanation: ['Could not reach the Risk Engine. Verify FastAPI is running on port 8000.']
      });
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
      setActiveStep(-1);
    }
  };

  const getRiskColor = () => {
    if (!result || result.level === 'ERROR') return '#233060';
    if (result.score > 70) return '#ff4d4d';
    if (result.score > 30) return '#ff9a44';
    return '#00ff88';
  };

  const getDynamicExplanation = (score) => {
    if (score === undefined || score === null) return ['Awaiting analysis...'];
    if (score > 70) return [
      'High transaction amount detected',
      'Unusual balance change observed',
      'Pattern matches fraud behavior',
      'High-risk transaction type',
      'Immediate attention required'
    ];
    if (score > 30) return [
      'Moderate transaction amount',
      'Some irregular balance movement',
      'Suspicious pattern detected',
      'Needs manual review',
      'Potential risk factors present'
    ];
    return [
      'Transaction within normal range',
      'No unusual balance change',
      'Behavior looks normal',
      'Low-risk transaction',
      'No immediate concerns'
    ];
  };

  return (
    <div className="app-shell">
      <h2 className="risk-analyzer-header">
        <span className="risk-analyzer-title">🛡️ ValliGuard AI</span>
        <span className="risk-analyzer-subtitle">Real-time Fraud Audit</span>
      </h2>

      <div className="dashboard-grid">
        <ParameterForm
          formData={formData}
          setFormData={setFormData}
          onAnalyze={handleAnalyze}
          loading={loading}
        />
        <PipelinePanel steps={steps} activeStep={activeStep} />
        <RiskResultPanel
          result={result}
          formData={formData}
          getRiskColor={getRiskColor}
          getDynamicExplanation={getDynamicExplanation}
        />
      </div>
    </div>
  );
};

export default RiskAnalyzer;
