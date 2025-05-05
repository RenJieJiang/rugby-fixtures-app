import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileNavigation from '@/app/ui/navigation/mobile-navigation';

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  Bars3Icon: () => <svg data-testid="bars3-icon" />,
  XMarkIcon: () => <svg data-testid="xmark-icon" />,
}));

// Mock Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('MobileNavigation Component', () => {
  it('renders the hamburger menu button', () => {
    // Arrange
    render(<MobileNavigation />);
    
    // Assert
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();
    expect(screen.getByTestId('bars3-icon')).toBeInTheDocument();
  });

  it('opens the menu when the button is clicked', () => {
    // Arrange
    render(<MobileNavigation />);
    
    // Assert - initial state
    expect(screen.getByTestId('bars3-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('xmark-icon')).not.toBeInTheDocument();
    
    // Act
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    
    // Assert - after clicking
    expect(screen.queryByTestId('bars3-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('xmark-icon')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Fixtures')).toBeInTheDocument();
    expect(screen.getByText('Upload Data')).toBeInTheDocument();
  });

  it('has clickable links in the opened menu', () => {
    // Arrange
    render(<MobileNavigation />);
    
    // Act
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    
    // Assert
    expect(screen.getByTestId('xmark-icon')).toBeInTheDocument();
    
    const homeLink = screen.getByText('Home');
    const fixturesLink = screen.getByText('Fixtures');
    const uploadLink = screen.getByText('Upload Data');
    
    expect(homeLink).toBeInTheDocument();
    expect(fixturesLink).toBeInTheDocument();
    expect(uploadLink).toBeInTheDocument();
    
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    expect(fixturesLink.closest('a')).toHaveAttribute('href', '/fixtures');
    expect(uploadLink.closest('a')).toHaveAttribute('href', '/upload');
  });
});