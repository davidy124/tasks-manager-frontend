import React from 'react';
import ErrorDisplay from './ErrorDisplay';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    if (error.message === 'Invalid username or password') {
      return null;
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (error.message !== 'Invalid username or password') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 