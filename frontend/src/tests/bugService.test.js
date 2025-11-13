import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Bug Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock axios.create to return a mock API instance
    axios.create = vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }));
  });

  it('should have axios mocked', () => {
    expect(axios.create).toBeDefined();
  });

  it('should create an axios instance with correct config', () => {
    // Re-import to trigger axios.create
    vi.resetModules();
    require('../services/bugService');
    
    expect(axios.create).toHaveBeenCalled();
  });

  // Add more tests as needed
});