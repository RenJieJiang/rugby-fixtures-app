import { searchFixtures } from '@/app/lib/actions/fixtures';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FixturesPage from '../page';
import { Fixture } from '@/app/lib/models/fixture';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

// Mock child components with proper Suspense handling
vi.mock('@/app/ui/fixtures/search', () => ({
  default: ({ placeholder }: { placeholder: string }) => (
    <input placeholder={placeholder} data-testid="search-input" />
  )
}));

vi.mock('@/app/ui/fixtures/fixture-list', () => ({
  default: ({ fixtures }: { fixtures: Fixture[] }) => (
    <div data-testid="fixture-list">
      {fixtures.map((f) => (
        <div key={f.fixture_mid}>{f.home_team} vs {f.away_team}</div>
      ))}
    </div>
  )
}));

vi.mock('@/app/ui/fixtures/fixture-list-skeleton', () => ({
  default: () => <div data-testid="loading-skeleton">Loading...</div>
}));

vi.mock('@/app/ui/fixtures/pagination', () => ({
  default: ({ totalPages }: { totalPages: number }) => (
    <div data-testid="pagination">Total pages: {totalPages}</div>
  )
}));

// Mock the searchFixtures action
vi.mock('@/app/lib/actions/fixtures', () => ({
  searchFixtures: vi.fn()
}));

describe('FixturesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFixture = { 
    fixture_mid: '1', 
    season: 2025,
    fixture_datetime: '2025-05-01T14:30:00Z',
    competition_name: 'Premiership',
    fixture_round: 1,
    home_team: 'Lions',
    away_team: 'Tigers'
  };

  it('renders the fixtures page with data successfully', async () => {
    vi.mocked(searchFixtures).mockResolvedValue({
      success: true,
      fixtures: [mockFixture],
      totalPages: 5,
      totalItems: 50
    });

    const props = {
      searchParams: Promise.resolve({
        query: 'test',
        page: '2'
      })
    };
    
    // Wrap in act to handle async operations
    await act(async () => {
      render(await FixturesPage(props));
    });

    // Verify main elements
    expect(screen.getByText('Rugby Fixtures')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    
    // The fixture list should be visible after loading
    expect(screen.getByTestId('fixture-list')).toBeInTheDocument();
    expect(screen.getByText('Lions vs Tigers')).toBeInTheDocument();
    
    // Verify pagination
    expect(screen.getByTestId('pagination')).toHaveTextContent('Total pages: 5');
    
    // Verify API call
    expect(searchFixtures).toHaveBeenCalledWith('test', 2, 10);
  });

  it('renders error message when data fetch fails', async () => {
    const errorMessage = 'Failed to load fixtures';
    vi.mocked(searchFixtures).mockResolvedValue({
      success: false,
      message: errorMessage
    });

    await act(async () => {
      render(await FixturesPage({ searchParams: Promise.resolve({}) }));
    });

    // The error message should be visible
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    // The fixture list should not be present
    expect(screen.queryByTestId('fixture-list')).not.toBeInTheDocument();
  });

  it('renders with default parameters when none provided', async () => {
    vi.mocked(searchFixtures).mockResolvedValue({
      success: true,
      fixtures: [],
      totalPages: 0,
      totalItems: 0
    });

    await act(async () => {
      render(await FixturesPage({ searchParams: Promise.resolve({}) }));
    });

    expect(searchFixtures).toHaveBeenCalledWith('', 1, 10);
    expect(screen.queryByText(/vs/)).not.toBeInTheDocument();
  });
});