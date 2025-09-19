import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 50%, #0a0a0a 100%);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h1`
  color: #ff6b6b;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #b3b3b3;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const ErrorDetails = styled.details`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: left;
  max-width: 800px;
  
  summary {
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  pre {
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 0.8rem;
    color: #ff9999;
  }
`;

const ReloadButton = styled.button`
  background: #1DB954;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #1ed760;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>💥</ErrorIcon>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            The Musicist app encountered an error. This might be due to a compatibility issue 
            or missing dependencies. Please try reloading the page.
          </ErrorMessage>
          
          <ReloadButton onClick={() => window.location.reload()}>
            Reload Page
          </ReloadButton>
          
          {this.state.error && (
            <ErrorDetails>
              <summary>Technical Details (for developers)</summary>
              <pre>
                <strong>Error:</strong> {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </ErrorDetails>
          )}
          
          <ErrorMessage style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
            If the problem persists, please check:
            <br />• Browser compatibility (Chrome, Firefox, Safari, Edge)
            <br />• JavaScript is enabled
            <br />• No ad blockers interfering
            <br />• Clear browser cache and cookies
          </ErrorMessage>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;