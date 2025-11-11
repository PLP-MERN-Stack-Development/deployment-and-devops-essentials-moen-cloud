import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Bug title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Bug description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    severity: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: '{VALUE} is not a valid severity level'
      },
      default: 'medium'
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in-progress', 'resolved', 'closed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'open'
    },
    assignedTo: {
      type: String,
      trim: true,
      default: 'Unassigned'
    },
    priority: {
      type: Number,
      min: [1, 'Priority must be at least 1'],
      max: [5, 'Priority cannot exceed 5'],
      default: 3
    },
    reproducible: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property to calculate bug age
bugSchema.virtual('age').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Index for faster queries
bugSchema.index({ status: 1, severity: -1 });

// Instance method to check if bug is stale (open for more than 30 days)
bugSchema.methods.isStale = function() {
  return this.status === 'open' && this.age > 30;
};

// Static method to find critical bugs
bugSchema.statics.findCritical = function() {
  return this.find({ severity: 'critical', status: { $ne: 'closed' } });
};

const Bug = mongoose.model('Bug', bugSchema);

export default Bug;