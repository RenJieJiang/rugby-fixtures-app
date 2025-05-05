import Search from '../ui/fixtures/search';
import FixtureList from '../ui/fixtures/fixture-list';
import FixtureListSkeleton from '../ui/fixtures/fixture-list-skeleton';
import Pagination from '../ui/fixtures/pagination';
import { searchFixtures } from '../lib/actions/fixtures';
import Link from 'next/link';
import { Suspense } from 'react';

interface FixturesPageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function FixturesPage(props: FixturesPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 10; // Items per page
  
  return (
    <div className="flex flex-col flex-grow h-full p-6 bg-gray-50">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Rugby Fixtures</h1>
          <nav aria-label="Admin actions">
            <Link href="/upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Upload Data
            </Link>
          </nav>
        </div>
      </header>
      
      <section aria-labelledby="search-heading" className="mb-8">
        <h2 id="search-heading" className="sr-only">Search fixtures</h2>
        <Search />
      </section>
      
      <Suspense fallback={
        <section aria-labelledby="loading-fixtures" className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <h2 id="loading-fixtures" className="sr-only">Loading fixture data</h2>
          <FixtureListSkeleton />
        </section>
      }>
        <FixturesContent query={query} currentPage={currentPage} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}

// Separate component to handle the data fetching with loading state
async function FixturesContent({ 
  query, 
  currentPage, 
  pageSize 
}: { 
  query: string; 
  currentPage: number; 
  pageSize: number;
}) {
  const { success, fixtures, message, totalPages } = await searchFixtures(
    query,
    currentPage,
    pageSize
  );

  if (!success) {
    return (
      <section aria-labelledby="error-heading" role="alert" className="p-4 bg-red-50 rounded-md">
        <h2 id="error-heading" className="sr-only">Error message</h2>
        <p className="text-red-800">{message || 'Error loading fixtures'}</p>
      </section>
    );
  }

  return (
    <>
      <section aria-labelledby="fixtures-heading" className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
        <h2 id="fixtures-heading" className="sr-only">Fixture search results</h2>
        <FixtureList fixtures={fixtures || []} />
      </section>
      
      {totalPages && totalPages > 1 && (
        <Pagination totalPages={totalPages} />
      )}
    </>
  );
}