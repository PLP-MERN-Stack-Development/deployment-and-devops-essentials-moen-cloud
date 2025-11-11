import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBugById, deleteBug } from '../services/bugService';
import { formatDate, formatDateTime } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const BugDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBugDetails();
  }, [id]);

  const fetchBugDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBugById(id);
      setBug(data);
      console.log('Bug details loaded:', data.title);
    } catch (err) {
      console.error('Error fetching bug details:', err);
      setError(err.message || 'Failed to load bug details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await deleteBug(id);
        console.log('Bug deleted successfully');
        navigate('/');
      } catch (err) {
        console.error('Error deleting bug:', err);
        alert('Failed to delete bug. Please try again.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading bug details..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={fetchBugDetails}
        showBackButton={true}
      />
    );
  }

  if (!bug) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Bug not found</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {bug.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 text-sm font-medium rounded ${getSeverityColor(bug.severity)}`}>
                {bug.severity.toUpperCase()}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(bug.status)}`}>
                {bug.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/edit/${bug._id}`}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
               Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
               Delete
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {bug.description}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Priority:</span>
              <span className="text-gray-800 font-semibold">{bug.priority}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Assigned To:</span>
              <span className="text-gray-800">{bug.assignedTo || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Reproducible:</span>
              <span className="text-gray-800">
                {bug.reproducible ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Bug Age:</span>
              <span className="text-gray-800">{bug.age || 0} days</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Timeline</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 font-medium block mb-1">Created:</span>
              <span className="text-gray-800">{formatDateTime(bug.createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium block mb-1">Last Updated:</span>
              <span className="text-gray-800">{formatDateTime(bug.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {bug.tags && bug.tags.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {bug.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default BugDetails;