import { Metadata } from 'next';
import { getFixture } from '../../lib/actions/fixtures';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface FixtureDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Browse Fixture Details",
};

export default async function FixtureDetailPage(props: FixtureDetailPageProps) {
  const params = await props.params;
  const id = params.id;
  const { success, fixture } = await getFixture(id);
  
  if (!success || !fixture) {
    notFound();
  }

  // Format the date for display
  const fixtureDate = new Date(fixture.fixture_datetime);
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
    <div className="flex flex-col flex-grow p-6 bg-gray-50">
      <nav className="mb-6" aria-label="Breadcrumb navigation">
        <Link href="/fixtures" className="text-blue-800 hover:text-blue-600">
          ← Back to all fixtures
        </Link>
      </nav>
      
      <article className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Fixture Details</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Round {fixture.fixture_round}
          </span>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-stretch">
          <section className="md:col-span-2 h-full" aria-labelledby="teams-heading">
            <h2 id="teams-heading" className="sr-only">Teams Information</h2>
            <div className="flex flex-col h-full bg-blue-50 rounded-lg">
              <h3 className="font-bold p-4 pb-2 text-gray-600">Teams</h3>
              <div className="flex items-center justify-between p-4 pt-0 flex-grow">
                <div className="text-center flex-1">
                  <p className="font-bold text-lg md:text-2xl text-gray-600">{fixture.home_team}</p>
                  <p className="text-sm md:text-lg text-gray-500">Home Team</p>
                </div>
                
                <div className="text-center text-2xl md:text-4xl font-bold px-4 text-gray-600">vs</div>
                
                <div className="text-center flex-1">
                  <p className="font-bold text-lg md:text-2xl text-gray-600">{fixture.away_team}</p>
                  <p className="text-sm md:text-lg text-gray-500">Away Team</p>
                </div>
              </div>
            </div>
          </section>
          
          <aside className="h-full">
            <section className="bg-blue-50 p-4 rounded-lg flex flex-col h-full" aria-labelledby="fixture-info-heading">
              <h2 id="fixture-info-heading" className="font-bold mb-2 text-gray-600">Fxiture Information</h2>
              <dl className="space-y-2 text-gray-600 flex-grow">
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
                  <dd className="inline ml-1">{fixture.competition_name}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Season:</dt>
                  <dd className="inline ml-1">{fixture.season}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Fxiture ID:</dt>
                  <dd className="inline ml-1">{fixture.fixture_mid}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </article>
    </div>
  );
}