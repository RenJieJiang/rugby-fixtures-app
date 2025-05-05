import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Add React to global scope for JSX
global.React = React;

// Mock next/navigation hooks to return working default implementations
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/fixtures',
  useSearchParams: () => ({
    get: vi.fn((param) => param === 'page' ? '2' : null),
    toString: vi.fn(() => ''),
  }),
}));