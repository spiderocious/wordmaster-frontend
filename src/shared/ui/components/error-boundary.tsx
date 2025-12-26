/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleGoHome = () => {
    // Clear error state and navigate to home
    window.location.href = '/';
  };

  handleReload = () => {
    // Reload the current page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-8">
          <motion.div
            className="max-w-2xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Icon */}
            <motion.div
              className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <FaExclamationTriangle className="text-5xl text-red-600" />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-black text-gray-900 mb-3">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 text-lg">
                We encountered an unexpected error. Don't worry, we've logged it
                and will look into it.
              </p>
            </motion.div>

            {/* Error Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg p-8 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Error Message */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Error Details
                </h2>
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-red-800 font-mono text-sm break-words">
                    {this.state.error?.message || 'Unknown error occurred'}
                  </p>
                </div>
              </div>

              {/* Stack Trace (Development Only)  import.meta.env.DEV &&  */}
              {this.state.errorInfo && (
                <details className="mb-6">
                  <summary className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider cursor-pointer hover:text-gray-900">
                    Stack Trace (Development)
                  </summary>
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4 mt-2 max-h-64 overflow-y-auto">
                    <pre className="text-gray-800 font-mono text-xs whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={this.handleGoHome}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-3 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaHome className="text-xl" />
                  Go to Home
                </motion.button>

                <motion.button
                  onClick={this.handleReload}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-3 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaRedo className="text-xl" />
                  Reload Page
                </motion.button>
              </div>
            </motion.div>

            {/* Help Text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-500 text-sm">
                If this problem persists, please contact support or try again later.
              </p>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
