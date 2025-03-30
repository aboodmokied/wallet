import React from 'react';
import ErrorPage from './ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an external service if needed
    console.error("Error caught in boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // If there is a Redux error or error boundary error, show the error page
      return <ErrorPage error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };
}

export default ErrorBoundary;
