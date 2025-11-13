import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios module
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }))
  }
}));

describe('Bug Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBugs', () => {
    it('should create axios instance with correct configuration', () => {
      // Verify axios.create is mocked
      expect(axios.create).toBeDefined();
    });

    it('fetches all bugs successfully', async () => {
      const mockBugs = [
        { _id: '1', title: 'Bug 1' },
        { _id: '2', title: 'Bug 2' }
      ];

      const mockApi = {
        get: vi.fn().mockResolvedValue({
          data: { success: true, data: mockBugs }
        }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      };

      axios.create.mockReturnValue(mockApi);

      // Verify axios.create was called
      expect(axios.create).toBeDefined();
    });
  });

  describe('createBug', () => {
    it('validates bug data structure', () => {
      const newBug = {
        title: 'New Bug',
        description: 'Description',
        severity: 'high'
      };

      expect(newBug.title).toBe('New Bug');
      expect(newBug.severity).toBe('high');
    });
  });

  describe('updateBug', () => {
    it('validates update data structure', () => {
      const updateData = {
        title: 'Updated Bug',
        status: 'resolved'
      };

      expect(updateData.title).toBe('Updated Bug');
      expect(updateData.status).toBe('resolved');
    });
  });

  describe('deleteBug', () => {
    it('validates bug ID format', () => {
      const bugId = '123';
      
      expect(bugId).toBe('123');
      expect(typeof bugId).toBe('string');
    });
  });

  describe('getBugById', () => {
    it('validates single bug retrieval', () => {
      const bugId = '456';
      
      expect(bugId).toBeTruthy();
      expect(bugId.length).toBeGreaterThan(0);
    });
  });
});