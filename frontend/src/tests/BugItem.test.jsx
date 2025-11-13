import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BugItem from '../components/BugItem';
import * as bugService from '../services/bugService';

vi.mock('../services/bugService');

const mockBug = {
  _id: '123',
  title: 'Test Bug',
  description: 'This is a test bug description',
  severity: 'high',
  status: 'open',
  priority: 4,
  assignedTo: 'John Doe',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('BugItem Component', () => {
  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderBugItem = (bug = mockBug) => {
    return render(
      <BrowserRouter>
        <BugItem bug={bug} onRefresh={mockOnRefresh} />
      </BrowserRouter>
    );
  };

  it('renders bug information correctly', () => {
    renderBugItem();
    
    expect(screen.getByText('Test Bug')).toBeInTheDocument();
    expect(screen.getByText(/this is a test bug description/i)).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('OPEN')).toBeInTheDocument();
  });

  it('shows edit and delete buttons', () => {
    renderBugItem();
    
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  it('calls deleteBug when delete button is clicked and confirmed', async () => {
    window.confirm = vi.fn(() => true);
    bugService.deleteBug.mockResolvedValue({});
    
    renderBugItem();
    
    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(bugService.deleteBug).toHaveBeenCalledWith('123');
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it('does not delete when confirmation is cancelled', () => {
    window.confirm = vi.fn(() => false);
    bugService.deleteBug.mockResolvedValue({});
    
    renderBugItem();
    
    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(bugService.deleteBug).not.toHaveBeenCalled();
  });

  it('displays assigned developer', () => {
    renderBugItem();
    
    expect(screen.getByText(/assigned to: john doe/i)).toBeInTheDocument();
  });

  it('displays priority level', () => {
    renderBugItem();
    
    expect(screen.getByText(/priority: 4/i)).toBeInTheDocument();
  });
});