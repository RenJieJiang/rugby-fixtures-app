import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from '@/app/ui/fixtures/search';

// Mock hooks with direct implementations to avoid serialization issues
const mockReplace = vi.fn();

// Create a proper implementation of the component's dependencies
vi.mock('next/navigation', () => {
  return {
    useRouter: () => {
      return { replace: mockReplace };
    },
    usePathname: () => '/fixtures',
    useSearchParams: () => {
      return {
        get: (param: string) => param === 'query' ? 'Test Query' : null,
        toString: () => '',
      };
    },
  };
});

// Mock debounce to execute immediately in tests
vi.mock('use-debounce', () => ({
  useDebouncedCallback: <T extends string>(fn: (term: T) => void) => fn,
}));

describe('Search Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the search input', () => {
    // Arrange
    render(<Search />);
    
    // Assert
    expect(screen.getByPlaceholderText('Search teams...')).toBeInTheDocument();
  });

  it('updates the URL when search input changes', () => {
    // Arrange
    render(<Search />);
    
    // Act
    const searchInput = screen.getByPlaceholderText('Search teams...') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Test Team' } });
    
    // Assert
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace.mock.calls[0][0]).toContain('Test+Team');
  });

  it('initializes with existing query from URL', () => {
    // Arrange
    render(<Search />);
    
    // Act
    const searchInput = screen.getByPlaceholderText('Search teams...') as HTMLInputElement;
    
    // Assert
    expect(searchInput.value).toBe('Test Query');
  });

  it('clears the search when clear button is clicked', () => {
    // Arrange
    render(<Search />);
    
    // Act
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    // Assert
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace.mock.calls[0][0]).not.toContain('query=');
  });
});