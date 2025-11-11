import { Link } from 'react-router-dom';
import { deleteBug } from '../services/bugService';
import { formatDate } from '../utils/helpers';

const BugItem = ({ bug, onRefresh }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await deleteBug(bug._id);
        console.log(' Bug deleted successfully');
        onRefresh(); // Refresh the bug list
      } catch (error) {
        console.error(' Error deleting bug:', error);
        alert('Failed to delete bug. Please try again.');
      }
    }
  };

  const getSeverityClass = (severity) => {
    return `severity-${severity}`;
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link to={`/bug/${bug._id}`} className="group">
            <h4 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
              {bug.title}
            </h4>
          </Link>
          
          <p className="text-gray-600 mt-1 line-clamp-2">
            {bug.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityClass(bug.severity)}`}>
              {bug.severity.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusClass(bug.status)}`}>
              {bug.status.replace('-', ' ').toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              Priority: {bug.priority}
            </span>
            <span className="text-xs text-gray-500">
              Assigned to: {bug.assignedTo || 'Unassigned'}
            </span>
            <span className="text-xs text-gray-500">
               {formatDate(bug.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <Link
            to={`/edit/${bug._id}`}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
             Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
             Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BugItem;