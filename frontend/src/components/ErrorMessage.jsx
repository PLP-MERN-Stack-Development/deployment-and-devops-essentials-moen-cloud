import { useNavigate } from 'react-router-dom';

const ErrorMessage = ({ message, onRetry, showBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4"> </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Error Occurred
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-4 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          )}
          {showBackButton && (
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;