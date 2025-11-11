import { validateBugData, sanitizeInput, formatBugResponse } from '../utils/validators.js';

describe('Validator Utilities', () => {
  
  describe('validateBugData', () => {
    it('should return null for valid bug data', () => {
      const validData = {
        title: 'Valid Bug',
        description: 'This is a valid description',
        severity: 'high',
        status: 'open'
      };

      const result = validateBugData(validData);
      expect(result).toBeNull();
    });

    it('should return error for missing title', () => {
      const invalidData = {
        description: 'Description without title'
      };

      const result = validateBugData(invalidData);
      expect(result).toBe('Title is required');
    });

    it('should return error for empty title', () => {
      const invalidData = {
        title: '   ',
        description: 'Description'
      };

      const result = validateBugData(invalidData);
      expect(result).toBe('Title is required');
    });

    it('should return error for title exceeding 100 characters', () => {
      const invalidData = {
        title: 'a'.repeat(101),
        description: 'Description'
      };

      const result = validateBugData(invalidData);
      expect(result).toBe('Title must be less than 100 characters');
    });

    it('should return error for missing description', () => {
      const invalidData = {
        title: 'Title without description'
      };

      const result = validateBugData(invalidData);
      expect(result).toBe('Description is required');
    });

    it('should return error for invalid severity', () => {
      const invalidData = {
        title: 'Valid Title',
        description: 'Valid Description',
        severity: 'super-high'
      };

      const result = validateBugData(invalidData);
      expect(result).toContain('Severity must be one of');
    });

    it('should return error for invalid status', () => {
      const invalidData = {
        title: 'Valid Title',
        description: 'Valid Description',
        status: 'pending'
      };

      const result = validateBugData(invalidData);
      expect(result).toContain('Status must be one of');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove script tags from strings', () => {
      const maliciousData = {
        title: '<script>alert("XSS")</script>Malicious Title',
        description: 'Normal description'
      };

      const sanitized = sanitizeInput(maliciousData);
      expect(sanitized.title).not.toContain('<script>');
      expect(sanitized.title).toBe('Malicious Title');
    });

    it('should trim whitespace from strings', () => {
      const dataWithWhitespace = {
        title: '  Padded Title  ',
        description: '  Padded Description  '
      };

      const sanitized = sanitizeInput(dataWithWhitespace);
      expect(sanitized.title).toBe('Padded Title');
      expect(sanitized.description).toBe('Padded Description');
    });

    it('should preserve non-string values', () => {
      const mixedData = {
        title: 'String Title',
        priority: 5,
        reproducible: true,
        tags: ['tag1', 'tag2']
      };

      const sanitized = sanitizeInput(mixedData);
      expect(sanitized.priority).toBe(5);
      expect(sanitized.reproducible).toBe(true);
      expect(sanitized.tags).toEqual(['tag1', 'tag2']);
    });

    it('should handle empty objects', () => {
      const emptyData = {};
      const sanitized = sanitizeInput(emptyData);
      expect(sanitized).toEqual({});
    });
  });

  describe('formatBugResponse', () => {
    it('should format bug object correctly', () => {
      const mockBug = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Test Bug',
        description: 'Test Description',
        severity: 'high',
        status: 'open',
        assignedTo: 'John Doe',
        priority: 4,
        reproducible: true,
        tags: ['frontend', 'critical'],
        age: 5,
        isStale: () => false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02')
      };

      const formatted = formatBugResponse(mockBug);
      
      expect(formatted.id).toBe('507f1f77bcf86cd799439011');
      expect(formatted.title).toBe('Test Bug');
      expect(formatted.age).toBe(5);
      expect(formatted.isStale).toBe(false);
    });
  });
});