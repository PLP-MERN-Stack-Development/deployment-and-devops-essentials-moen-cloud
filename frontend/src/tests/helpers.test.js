import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateTime,
  truncateText,
  capitalize,
  getSeverityColor,
  getStatusColor
} from '../utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('formats date and time correctly', () => {
      const dateTime = '2024-01-15T10:30:00Z';
      const formatted = formatDateTime(dateTime);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('at');
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'a'.repeat(150);
      const truncated = truncateText(longText, 100);
      expect(truncated.length).toBe(103); // 100 + '...'
      expect(truncated).toContain('...');
    });

    it('does not truncate short text', () => {
      const shortText = 'Short text';
      const result = truncateText(shortText, 100);
      expect(result).toBe(shortText);
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });
  });

  describe('getSeverityColor', () => {
    it('returns correct color for each severity', () => {
      expect(getSeverityColor('low')).toBe('text-green-600');
      expect(getSeverityColor('medium')).toBe('text-yellow-600');
      expect(getSeverityColor('high')).toBe('text-orange-600');
      expect(getSeverityColor('critical')).toBe('text-red-600');
    });

    it('returns default color for unknown severity', () => {
      expect(getSeverityColor('unknown')).toBe('text-gray-600');
    });
  });

  describe('getStatusColor', () => {
    it('returns correct color for each status', () => {
      expect(getStatusColor('open')).toBe('text-blue-600');
      expect(getStatusColor('in-progress')).toBe('text-purple-600');
      expect(getStatusColor('resolved')).toBe('text-green-600');
      expect(getStatusColor('closed')).toBe('text-gray-600');
    });
  });
});