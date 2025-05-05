import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import FixturesPage from '../page';
import { searchFixtures } from '@/app/lib/actions/fixtures';
import { Fixture } from '@/app/lib/models/fixture';

// Define the return type for searchFixtures
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
  default: ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  }
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

  it('renders the fixtures page with data successfully', async () => {
    // Mock successful response
    const mockFixtures: Fixture[] = [{ 
      fixture_mid: '1', 
      season: 2025,
      fixture_datetime: '2025-05-01T14:30:00Z',
      competition_name: 'Premiership',
      fixture_round: 1,
      home_team: 'Lions',
      away_team: 'Tigers'
    }];
    
    const mockResponse: SearchFixturesReturn = {
      success: true,
      fixtures: mockFixtures,
      totalPages: 5,
      totalItems: 50,
      message: ''
    };
    
    // Use Vitest's Mock type instead of Jest's
    (searchFixtures as unknown as Mock).mockResolvedValue(mockResponse);

    // Since the page component is async, we need to use await render
    const props = {
      searchParams: Promise.resolve({
        query: 'test',
        page: '2'
      })
    };
    
    const page = await FixturesPage(props);
    render(page);

    // Header elements
    expect(screen.getByText('Rugby Fixtures')).toBeInTheDocument();
    expect(screen.getByText('Upload Data')).toBeInTheDocument();
    
    // Check if the components are rendered
    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByTestId('fixture-list-component')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
    
    // Verify searchFixtures was called with the right parameters
    expect(searchFixtures).toHaveBeenCalledWith('test', 2, 10);
  });

  it('renders the fixtures page with default parameters when none provided', async () => {
    // Mock successful response with empty fixtures
    const mockResponse: SearchFixturesReturn = {
      success: true,
      fixtures: [],
      totalPages: 0,
      totalItems: 0,
      message: ''
    };
    
    // Use Vitest's Mock type instead of Jest's
    (searchFixtures as unknown as Mock).mockResolvedValue(mockResponse);

    // Props with empty search params
    const props = {
      searchParams: Promise.resolve({})
    };
    
    const page = await FixturesPage(props);
    render(page);

    // Verify searchFixtures was called with default parameters
    expect(searchFixtures).toHaveBeenCalledWith('', 1, 10);
  });

  it('renders error message when data fetch fails', async () => {
    // Mock error response
    const mockResponse: SearchFixturesReturn = {
      success: false,
      fixtures: [],
      totalPages: 0,
      totalItems: 0,
      message: 'Failed to load fixtures'
    };
    
    // Use Vitest's Mock type instead of Jest's
    (searchFixtures as unknown as Mock).mockResolvedValue(mockResponse);

    const props = {
      searchParams: Promise.resolve({})
    };
    
    const page = await FixturesPage(props);
    render(page);

    // Error message should be displayed
    expect(screen.getByText('Failed to load fixtures')).toBeInTheDocument();
    
    // Fixture list and pagination should not be rendered
    expect(screen.queryByTestId('fixture-list-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination-component')).not.toBeInTheDocument();
  });
});