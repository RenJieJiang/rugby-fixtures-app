import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FixturesPage from '../page';
import { searchFixtures } from '@/app/lib/actions/fixtures';
import { Fixture } from '@/app/lib/models/fixture';

type SearchFixturesReturn = {
  success: boolean;
  fixtures?: Fixture[];
  message?: string;
  totalPages?: number;
  totalItems?: number;
};

// Mock the imports
vi.mock('@/app/lib/actions/fixtures', () => ({
  searchFixtures: vi.fn()
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  )
}));

vi.mock('@/app/ui/fixtures/search', () => ({
  default: () => <div data-testid="search-component">Search Component</div>
}));

vi.mock('@/app/ui/fixtures/fixture-list', () => ({
  default: ({ fixtures }: { fixtures: Fixture[] }) => (
    <div data-testid="fixture-list-component">
      Fixture List Component with {fixtures.length} fixtures
    </div>
  )
}));

vi.mock('@/app/ui/fixtures/pagination', () => ({
  default: ({ totalPages }: { totalPages: number }) => (
    <div data-testid="pagination-component">
      Pagination Component with {totalPages} pages
    </div>
  )
}));

describe('FixturesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFixture: Fixture = { 
    fixture_mid: '1', 
    season: 2025,
    fixture_datetime: '2025-05-01T14:30:00Z',
    competition_name: 'Premiership',
    fixture_round: 1,
    home_team: 'Lions',
    away_team: 'Tigers'
  };

  it('renders the fixtures page with data successfully', async () => {
    // Arrange
    const mockResponse: SearchFixturesReturn = {
      success: true,
      fixtures: [mockFixture],
      totalPages: 5,
      totalItems: 50
    };
    
    vi.mocked(searchFixtures).mockResolvedValue(mockResponse);

    const props = {
      searchParams: Promise.resolve({
        query: 'test',
        page: '2'
      })
    };
    
    // Act
    render(await FixturesPage(props));

    // Assert
    expect(screen.getByText('Rugby Fixtures')).toBeInTheDocument();
    expect(screen.getByTestId('fixture-list-component')).toHaveTextContent(
      'Fixture List Component with 1 fixtures'
    );
    expect(screen.getByTestId('pagination-component')).toHaveTextContent(
      'Pagination Component with 5 pages'
    );
    expect(searchFixtures).toHaveBeenCalledWith('test', 2, 10);
  });

  it('renders with default parameters when none provided', async () => {
    // Arrange
    vi.mocked(searchFixtures).mockResolvedValue({
      success: true,
      fixtures: [],
      totalPages: 0,
      totalItems: 0
    });

    // Act
    render(await FixturesPage({ searchParams: Promise.resolve({}) }));

    // Assert
    expect(searchFixtures).toHaveBeenCalledWith('', 1, 10);
    expect(screen.getByTestId('fixture-list-component')).toHaveTextContent(
      'Fixture List Component with 0 fixtures'
    );
  });

  it('renders error message when data fetch fails', async () => {
    // Arrange
    const errorMessage = 'Failed to load fixtures';
    vi.mocked(searchFixtures).mockResolvedValue({
      success: false,
      message: errorMessage
    });

    // Act
    render(await FixturesPage({ searchParams: Promise.resolve({}) }));

    // Assert
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByTestId('fixture-list-component')).not.toBeInTheDocument();
  });

  it('handles undefined fixtures array by showing empty state', async () => {
    // Arrange
    vi.mocked(searchFixtures).mockResolvedValue({
      success: true,
      totalPages: 1,
      totalItems: 0
      // fixtures intentionally omitted
    });
  
    // Act
    render(await FixturesPage({ searchParams: Promise.resolve({}) }));
  
    // Assert
    expect(screen.getByTestId('fixture-list-component')).toHaveTextContent(
      'Fixture List Component with 0 fixtures'
    );
  });
});