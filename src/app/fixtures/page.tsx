import Search from '../ui/fixtures/search';
import FixtureList from '../ui/fixtures/fixture-list';
import { searchFixtures } from '../lib/actions/fixtures';
import { Fixture } from '@/app/lib/definitions';
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
  
  // Type assertion to ensure TypeScript recognizes the fixtures array correctly
  const typedFixtures = (fixtures || []) as unknown as Fixture[];

  return (
    <main className="flex flex-col p-6">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rugby Fixtures</h1>
          <nav aria-label="Admin actions">
            <Link href="/upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Upload Fixtures
            </Link>
          </nav>
        </div>
      </header>
      
      <section aria-labelledby="search-heading" className="mb-8">
        <h2 id="search-heading" className="sr-only">Search fixtures</h2>
        <Search />
      </section>
      
      {success ? (
        <section aria-labelledby="fixtures-heading" className="bg-white shadow-sm rounded-lg overflow-hidden">
          <h2 id="fixtures-heading" className="sr-only">Fixture results</h2>
          <FixtureList fixtures={typedFixtures} />
        </section>
      ) : (
        <section aria-labelledby="error-heading" role="alert" className="p-4 bg-red-50 rounded-md">
          <h2 id="error-heading" className="sr-only">Error message</h2>
          <p className="text-red-800">{message || 'Error loading fixtures'}</p>
        </section>
      )}
    </main>
  );
}