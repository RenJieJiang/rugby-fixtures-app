import Search from '../ui/fixtures/search';
import FixtureList from '../ui/fixtures/fixture-list';
import { searchFixtures } from '../lib/actions/fixtures';
import Link from 'next/link';

export default async function FixturesPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const { success, fixtures, message } = await searchFixtures(query);

  return (
    <div className="flex flex-col flex-grow h-full p-6 bg-gray-50">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Rugby Matches</h1>
          <nav aria-label="Admin actions">
            <Link href="/upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Upload Data
            </Link>
          </nav>
        </div>
      </header>
      
      <section aria-labelledby="search-heading" className="mb-8">
        <h2 id="search-heading" className="sr-only">Search matches</h2>
        <Search />
      </section>
      
      {success ? (
        <section aria-labelledby="fixtures-heading" className="bg-white shadow-sm rounded-lg overflow-hidden">
          <h2 id="fixtures-heading" className="sr-only">Match results</h2>
          <FixtureList fixtures={fixtures || []} />
        </section>
      ) : (
        <section aria-labelledby="error-heading" role="alert" className="p-4 bg-red-50 rounded-md">
          <h2 id="error-heading" className="sr-only">Error message</h2>
          <p className="text-red-800">{message || 'Error loading matches'}</p>
        </section>
      )}
    </div>
  );
}