import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiWifiOff, FiCheckCircle } from 'react-icons/fi';

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const IndicatorContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: ${slideDown} 0.3s ease-out;
`;

const OfflineIndicator = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);

  svg {
    animation: ${pulse} 2s infinite;
  }
`;

const OnlineIndicator = styled.div`
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(81, 207, 102, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ConnectionIndicator = ({ isOnline, wasOffline }) => {
  // Don't show anything if we're online and were never offline
  if (isOnline && !wasOffline) {
    return null;
  }

  // Show "Back online" message briefly when connection is restored
  if (isOnline && wasOffline) {
    return (
      <IndicatorContainer>
        <OnlineIndicator>
          <FiCheckCircle />
          <span>Back online!</span>
        </OnlineIndicator>
      </IndicatorContainer>
    );
  }

  // Show offline indicator
  if (!isOnline) {
    return (
      <IndicatorContainer>
        <OfflineIndicator>
          <FiWifiOff />
          <span>Offline mode</span>
        </OfflineIndicator>
      </IndicatorContainer>
    );
  }

  return null;
};

export default ConnectionIndicator;