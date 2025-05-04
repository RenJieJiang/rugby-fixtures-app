import { getFixture } from '../../lib/actions/fixtures';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function FixtureDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const { success, fixture } = await getFixture(id);
  
  if (!success || !fixture) {
    notFound();
  }

  // Type assertion to ensure TypeScript recognizes the fixture properties
  const typedFixture = fixture;

  // Format the date for display
  const fixtureDate = new Date(typedFixture.fixture_datetime);
  const formattedDate = fixtureDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = fixtureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Create a string version of the date for the dateTime attribute
  const dateTimeString = fixtureDate.toISOString();

  return (
    <main className="flex flex-col min-h-screen p-6">
      <nav className="mb-6" aria-label="Breadcrumb navigation">
        <Link href="/fixtures" className="text-gray-200 hover:text-white">
          ← Back to all fixtures
        </Link>
      </nav>
      
      <article className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Match Details</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Round {typedFixture.fixture_round}
          </span>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2" aria-labelledby="teams-heading">
            <h2 id="teams-heading" className="sr-only">Teams Information</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="text-center flex-1">
                <p className="font-bold text-lg text-gray-600">{typedFixture.home_team}</p>
                <p className="text-sm text-gray-500">Home Team</p>
              </div>
              
              <div className="text-center text-2xl font-bold px-4 text-gray-600">vs</div>
              
              <div className="text-center flex-1">
                <p className="font-bold text-lg text-gray-600">{typedFixture.away_team}</p>
                <p className="text-sm text-gray-500">Away Team</p>
              </div>
            </div>
          </section>
          
          <aside>
            <section className="bg-gray-50 p-4 rounded-lg" aria-labelledby="match-info-heading">
              <h2 id="match-info-heading" className="font-bold mb-2 text-gray-600">Match Information</h2>
              <dl className="space-y-2 text-gray-600">
                <div>
                  <dt className="inline font-medium">Date:</dt>
                  <dd className="inline ml-1">
                    <time dateTime={dateTimeString}>{formattedDate}</time>
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium">Time:</dt>
                  <dd className="inline ml-1">
                    <time dateTime={dateTimeString}>{formattedTime}</time>
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium">Competition:</dt>
                  <dd className="inline ml-1">{typedFixture.competition_name}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Season:</dt>
                  <dd className="inline ml-1">{typedFixture.season}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Match ID:</dt>
                  <dd className="inline ml-1">{typedFixture.fixture_mid}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}