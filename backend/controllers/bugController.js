import Bug from '../models/Bug.js';
import { validateBugData, sanitizeInput } from '../utils/validators.js';

/**
 * @desc    Get all bugs
 * @route   GET /api/bugs
 * @access  Public
 */
export const getAllBugs = async (req, res, next) => {
  try {
    // Extract query parameters for filtering
    const { status, severity, sortBy = '-createdAt' } = req.query;

    // Build query object
    const query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;

    console.log(' Fetching bugs with filters:', query);

    const bugs = await Bug.find(query).sort(sortBy);

    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  } catch (error) {
    console.error('Error in getAllBugs:', error);
    next(error);
  }
};

/**
 * @desc    Get single bug by ID
 * @route   GET /api/bugs/:id
 * @access  Public
 */
export const getBugById = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      const error = new Error('Bug not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: bug
    });
  } catch (error) {
    console.error('Error in getBugById:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'Invalid bug ID format';
    }
    
    next(error);
  }
};

/**
 * @desc    Create new bug
 * @route   POST /api/bugs
 * @access  Public
 */
export const createBug = async (req, res, next) => {
  try {
    // Sanitize input
    const sanitizedData = sanitizeInput(req.body);
    
    // Validate bug data
    const validationError = validateBugData(sanitizedData);
    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      throw error;
    }

    console.log(' Creating new bug:', sanitizedData.title);

    const bug = await Bug.create(sanitizedData);

    res.status(201).json({
      success: true,
      message: 'Bug created successfully',
      data: bug
    });
  } catch (error) {
    console.error('Error in createBug:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
      error.message = Object.values(error.errors).map(err => err.message).join(', ');
    }
    
    next(error);
  }
};

/**
 * @desc    Update bug
 * @route   PUT /api/bugs/:id
 * @access  Public
 */
export const updateBug = async (req, res, next) => {
  try {
    // Sanitize input
    const sanitizedData = sanitizeInput(req.body);

    console.log(' Updating bug:', req.params.id);

    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      sanitizedData,
      {
        new: true, // Return updated document
        runValidators: true // Run model validators
      }
    );

    if (!bug) {
      const error = new Error('Bug not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Bug updated successfully',
      data: bug
    });
  } catch (error) {
    console.error('Error in updateBug:', error);
    
    if (error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'Invalid bug ID format';
    }
    
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
      error.message = Object.values(error.errors).map(err => err.message).join(', ');
    }
    
    next(error);
  }
};

/**
 * @desc    Delete bug
 * @route   DELETE /api/bugs/:id
 * @access  Public
 */
export const deleteBug = async (req, res, next) => {
  try {
    console.log(' Deleting bug:', req.params.id);

    const bug = await Bug.findByIdAndDelete(req.params.id);

    if (!bug) {
      const error = new Error('Bug not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Bug deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error in deleteBug:', error);
    
    if (error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'Invalid bug ID format';
    }
    
    next(error);
  }
};

/**
 * @desc    Get bug statistics
 * @route   GET /api/bugs/stats
 * @access  Public
 */
export const getBugStats = async (req, res, next) => {
  try {
    const stats = await Bug.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const severityStats = await Bug.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: stats,
        bySeverity: severityStats,
        total: await Bug.countDocuments()
      }
    });
  } catch (error) {
    console.error('Error in getBugStats:', error);
    next(error);
  }
};