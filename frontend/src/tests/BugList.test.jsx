import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BugList from '../components/BugList';

const mockBugs = [
  {
    _id: '1',
    title: 'Bug 1',
    description: 'Description 1',
    severity: 'high',
    status: 'open',
    priority: 5,
    assignedTo: 'John Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Bug 2',
    description: 'Description 2',
    severity: 'low',
    status: 'closed',
    priority: 2,
    assignedTo: 'Jane Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

describe('BugList Component', () => {
  const renderBugList = (bugs = mockBugs) => {
    return render(
      <BrowserRouter>
        <BugList bugs={bugs} onRefresh={vi.fn()} />
      </BrowserRouter>
    );
  };

  it('renders bug list with all bugs', () => {
    renderBugList();
    
    expect(screen.getByText('Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Bug 2')).toBeInTheDocument();
  });

  it('displays empty state when no bugs', () => {
    renderBugList([]);
    
    expect(screen.getByText(/no bugs found/i)).toBeInTheDocument();
    expect(screen.getByText(/report your first bug/i)).toBeInTheDocument();
  });

  it('displays bug count correctly', () => {
    renderBugList();
    
    expect(screen.getByText(/bug list \(2\)/i)).toBeInTheDocument();
  });

  it('shows severity badges', () => {
    renderBugList();
    
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('shows status badges', () => {
    renderBugList();
    
    expect(screen.getByText('OPEN')).toBeInTheDocument();
    expect(screen.getByText('CLOSED')).toBeInTheDocument();
  });
});