import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Pagination from '@/app/ui/fixtures/pagination';

// Mock hooks with more stable implementations
const mockGet = vi.fn();
const mockToString = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/fixtures',
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: mockGet,
    toString: mockToString,
  }),
}));

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  ArrowLeftIcon: () => <svg data-testid="arrow-left-icon" />,
  ArrowRightIcon: () => <svg data-testid="arrow-right-icon" />,
}));

describe('Pagination Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockImplementation((param) => param === 'page' ? '2' : null);
    mockToString.mockReturnValue('page=2');
  });

  it('renders pagination with correct number of pages', () => {
    // Arrange
    render(<Pagination totalPages={5} />);
    
    // Assert
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    // Arrange
    render(<Pagination totalPages={5} />);
    
    // Act
    const currentPageElement = screen.getByText('2').closest('div');
    
    // Assert
    expect(currentPageElement).toHaveClass('bg-blue-600');
  });

  it('disables the previous button when on first page', () => {
    // Arrange
    // Override the mock to return page 1
    mockGet.mockImplementation((param) => param === 'page' ? '1' : null);
    mockToString.mockReturnValue('page=1');

    // Act
    render(<Pagination totalPages={5} />);
    
    // Assert
    const leftArrow = screen.getByTestId('arrow-left-icon');
    const leftArrowWrapper = leftArrow.closest('div');
    expect(leftArrowWrapper).toHaveClass('pointer-events-none');
  });

  it('disables the next button when on last page', () => {
    // Arrange
    // Override the mock to return the last page
    mockGet.mockImplementation((param) => param === 'page' ? '5' : null);
    mockToString.mockReturnValue('page=5');

    // Act
    render(<Pagination totalPages={5} />);
    
    // Assert
    const rightArrow = screen.getByTestId('arrow-right-icon');
    const rightArrowWrapper = rightArrow.closest('div');
    expect(rightArrowWrapper).toHaveClass('pointer-events-none');
  });
});