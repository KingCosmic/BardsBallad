import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import {syncStripeData} from "@api/syncStripeData";

const SubscriptionConfirmation: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/settings');
  };

  useEffect(() => {
    syncStripeData()
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Subscription Successful!</h1>
      <p>Thank you for subscribing to Bard's Ballad. Your subscription was processed successfully.</p>
      <p>We hope you enjoy all the premium features and content!</p>
      <button 
        onClick={handleGoBack} 
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Back to Settings
      </button>
    </div>
  );
};

export default SubscriptionConfirmation;
