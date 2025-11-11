const BugStats = ({ stats }) => {
  const getStatusCount = (status) => {
    const stat = stats.byStatus.find(s => s._id === status);
    return stat ? stat.count : 0;
  };

  const getSeverityCount = (severity) => {
    const stat = stats.bySeverity.find(s => s._id === severity);
    return stat ? stat.count : 0;
  };

  const statCards = [
    {
      label: 'Total Bugs',
      value: stats.total,
      icon: '🐛',
      color: 'bg-blue-500'
    },
    {
      label: 'Open',
      value: getStatusCount('open'),
      icon: '📝',
      color: 'bg-yellow-500'
    },
    {
      label: 'In Progress',
      value: getStatusCount('in-progress'),
      icon: '⚙️',
      color: 'bg-purple-500'
    },
    {
      label: 'Resolved',
      value: getStatusCount('resolved'),
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      label: 'Critical',
      value: getSeverityCount('critical'),
      icon: '🚨',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{card.icon}</span>
            <span className={`${card.color} text-white text-2xl font-bold px-3 py-1 rounded`}>
              {card.value}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default BugStats;