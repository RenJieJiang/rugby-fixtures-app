import React from 'react';
import { FixtureTableContainer, FixtureTableHeader } from './fixture-table-components';

export default function FixtureListSkeleton() {
  // Generate array of 5 items for skeleton rows
  const skeletonRows = Array.from({ length: 5 }, (_, i) => i);

  return (
    <>
      {/* Desktop Table View (Hidden on small screens) */}
      <FixtureTableContainer ariaLabel="Loading rugby fixtures">
        <FixtureTableHeader />
        <tbody className="bg-white divide-y divide-gray-200">
          {skeletonRows.map((index) => (
            <tr key={`skeleton-desktop-${index}`} className="animate-pulse">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-blue-100 rounded w-24"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </FixtureTableContainer>

      {/* Mobile Card View (Visible only on small screens) */}
      <div className="sm:hidden space-y-4">
        {skeletonRows.map((index) => (
          <div 
            key={`skeleton-mobile-${index}`} 
            className="bg-blue-50 py-5 border-b border-gray-300 space-y-3 px-4 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-blue-100 rounded w-20"></div>
            </div>
            
            <div className="flex flex-col space-y-3 justify-center items-center py-2">
              <div className="h-5 bg-gray-200 rounded w-28"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
              <div className="h-5 bg-gray-200 rounded w-28"></div>
            </div>

            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-blue-100 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}