import React, { ReactNode } from 'react';

// Column definition interface
export interface FixtureTableColumn {
  id: string;
  label: string;
}

// Define the standard fixture table columns
export const FIXTURE_TABLE_COLUMNS: FixtureTableColumn[] = [
  { id: 'time', label: 'Time' },
  { id: 'competition', label: 'Competition' },
  { id: 'round', label: 'Round' },
  { id: 'homeTeam', label: 'Home Team' },
  { id: 'awayTeam', label: 'Away Team' },
  { id: 'actions', label: 'Actions' },
];

// Props for the table header component
interface FixtureTableHeaderProps {
  columns?: FixtureTableColumn[];
}

export function FixtureTableHeader({ columns = FIXTURE_TABLE_COLUMNS }: FixtureTableHeaderProps) {
  return (
    <thead className="bg-blue-50 sticky top-0">
      <tr>
        {columns.map((column) => (
          <th 
            key={column.id}
            scope="col" 
            className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// Props for the table container component
interface FixtureTableContainerProps {
  children: ReactNode;
  ariaLabel?: string;
}

export function FixtureTableContainer({ children, ariaLabel = "Rugby fixtures" }: FixtureTableContainerProps) {
  return (
    <div className="overflow-x-auto sm:mx-0">
      <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 hidden sm:table" aria-label={ariaLabel}>
          <caption className="sr-only">List of rugby fixtures with date, competition, teams, and other details</caption>
          {children}
        </table>
      </div>
    </div>
  );
}