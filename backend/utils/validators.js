/**
 * Validates bug data before creating/updating
 * @param {Object} bugData - Bug data to validate
 * @returns {String|null} - Error message or null if valid
 */
export const validateBugData = (bugData) => {
  const { title, description, severity, status } = bugData;

  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }

  if (title.length > 100) {
    return 'Title must be less than 100 characters';
  }

  if (!description || description.trim().length === 0) {
    return 'Description is required';
  }

  if (description.length > 1000) {
    return 'Description must be less than 1000 characters';
  }

  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (severity && !validSeverities.includes(severity)) {
    return `Severity must be one of: ${validSeverities.join(', ')}`;
  }

  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  if (status && !validStatuses.includes(status)) {
    return `Status must be one of: ${validStatuses.join(', ')}`;
  }

  return null; // Valid
};

/**
 * Sanitizes input data to prevent injection attacks
 * @param {Object} data - Input data to sanitize
 * @returns {Object} - Sanitized data
 */
export const sanitizeInput = (data) => {
  const sanitized = {};

  for (const key in data) {
    if (typeof data[key] === 'string') {
      // Remove potential script tags and trim whitespace
      sanitized[key] = data[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .trim();
    } else {
      sanitized[key] = data[key];
    }
  }

  return sanitized;
};

/**
 * Formats a bug object for API response
 * @param {Object} bug - Bug document
 * @returns {Object} - Formatted bug object
 */
export const formatBugResponse = (bug) => {
  return {
    id: bug._id,
    title: bug.title,
    description: bug.description,
    severity: bug.severity,
    status: bug.status,
    assignedTo: bug.assignedTo,
    priority: bug.priority,
    reproducible: bug.reproducible,
    tags: bug.tags,
    age: bug.age,
    isStale: bug.isStale(),
    createdAt: bug.createdAt,
    updatedAt: bug.updatedAt
  };
};