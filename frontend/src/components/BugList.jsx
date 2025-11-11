import { useState } from 'react';
import { Link } from 'react-router-dom';
import BugItem from './BugItem';

const BugList = ({ bugs, onRefresh }) => {
  const [sortBy, setSortBy] = useState('newest');

  // Sort bugs based on selected option
  const sortedBugs = [...bugs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'severity':
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      case 'priority':
        return b.priority - a.priority;
      default:
        return 0;
    }
  });

  if (bugs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="text-6xl mb-4"> </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          No Bugs Found
        </h3>
        <p className="text-gray-600 mb-6">
          Either all bugs are fixed, or no bugs have been reported yet.
        </p>
        <Link
          to="/create"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Report Your First Bug
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Bug List ({bugs.length})
        </h3>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="severity">Severity</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedBugs.map((bug) => (
          <BugItem key={bug._id} bug={bug} onRefresh={onRefresh} />
        ))}
      </div>
    </div>
  );
};

export default BugList;