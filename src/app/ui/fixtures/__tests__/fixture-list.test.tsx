import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FixtureList from '@/app/ui/fixtures/fixture-list';
import { Fixture } from '@/app/lib/models/fixture';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  }
}));

describe('FixtureList Component', () => {
  const mockFixtures: Fixture[] = [
    {
      fixture_mid: '1',
      season: 2025,
      fixture_datetime: '2025-05-01T14:30:00Z',
      competition_name: 'Premiership',
      fixture_round: 1,
      home_team: 'Lions',
      away_team: 'Tigers'
    },
    {
      fixture_mid: '2',
      season: 2025,
      fixture_datetime: '2025-05-08T19:45:00Z',
      competition_name: 'Champions Cup',
      fixture_round: 4,
      home_team: 'Bears',
      away_team: 'Sharks'
    }
  ];

  it('renders fixtures in a table on desktop and cards on mobile', () => {
    // Arrange
    render(<FixtureList fixtures={mockFixtures} />);

    // Assert
    // Desktop view (table)
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Check that fixture data is rendered - using getAllByText instead of getByText
    expect(screen.getAllByText('Lions')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Tigers')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Bears')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sharks')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Premiership')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Champions Cup')[0]).toBeInTheDocument();
    
    // Check for mobile cards
    const mobileCards = document.querySelectorAll('.sm\\:hidden > div');
    expect(mobileCards.length).toBe(2);
  });
  
  it('displays "No fixtures found" message when fixtures array is empty', () => {
    // Arrange
    render(<FixtureList fixtures={[]} />);
    
    // Assert
    // Should show no fixtures message
    expect(screen.getByText('No fixtures found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search query')).toBeInTheDocument();
    
    // Table should not be rendered
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
  
  it('renders "View Details" links with correct URLs', () => {
    // Arrange
    render(<FixtureList fixtures={mockFixtures} />);

    // Assert
    // Find all detail links
    const detailLinks = screen.getAllByText('View Details');
    
    // There should be one link per fixture in both desktop and mobile views (so 2x2=4)
    expect(detailLinks).toHaveLength(4);
    
    // Check desktop links
    expect(detailLinks[0].closest('a')).toHaveAttribute('href', '/fixtures/1');
    expect(detailLinks[1].closest('a')).toHaveAttribute('href', '/fixtures/2');
    
    // Check mobile links
    expect(detailLinks[2].closest('a')).toHaveAttribute('href', '/fixtures/1');
    expect(detailLinks[3].closest('a')).toHaveAttribute('href', '/fixtures/2');
  });
});