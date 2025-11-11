import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BugForm from '../components/BugForm';
import * as bugService from '../services/bugService';

// Mock the bug service
vi.mock('../services/bugService');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
  };
});

describe('BugForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderBugForm = () => {
    return render(
      <BrowserRouter>
        <BugForm />
      </BrowserRouter>
    );
  };

  it('renders the form with all fields', () => {
    renderBugForm();
    
    expect(screen.getByLabelText(/bug title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/severity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it('shows validation error for empty title', async () => {
    renderBugForm();
    
    const submitButton = screen.getByText(/create bug/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    bugService.createBug.mockResolvedValue({ _id: '123', title: 'Test Bug' });
    
    renderBugForm();
    
    const titleInput = screen.getByLabelText(/bug title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByText(/create bug/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Bug Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test bug description' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(bugService.createBug).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Bug Title',
          description: 'Test bug description'
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on submission failure', async () => {
    bugService.createBug.mockRejectedValue(new Error('Network error'));
    renderBugForm();
    
    const titleInput = screen.getByLabelText(/bug title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByText(/create bug/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Bug' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('updates character count as user types', () => {
    renderBugForm();
    
    const titleInput = screen.getByLabelText(/bug title/i);
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    
    expect(screen.getByText(/4\/100 characters/i)).toBeInTheDocument();
  });

  it('handles checkbox toggle', () => {
    renderBugForm();
    
    const checkbox = screen.getByLabelText(/bug is reproducible/i);
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});