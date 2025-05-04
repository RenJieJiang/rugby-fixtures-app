import { Fixture } from '@/app/lib/models/fixture';
import Link from 'next/link';

export default function FixtureList({ fixtures }: { fixtures: Fixture[] }) {
  if (fixtures.length === 0) {
    return (
      <div role="alert" className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">No fixtures found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto sm:mx-0">
      <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
        {/* Desktop Table View (Hidden on small screens) */}
        <table className="min-w-full divide-y divide-gray-200 hidden sm:table" aria-label="Rugby fixtures">
          <caption className="sr-only">List of rugby fixtures with date, competition, teams, and other details</caption>
          <thead className="bg-blue-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Competition</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Round</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Home Team</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Away Team</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fixtures.map((fixture) => {
              // Format the date for display
              const fixtureDate = new Date(fixture.fixture_datetime);
              const formattedDate = fixtureDate.toLocaleDateString();
              const formattedTime = fixtureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              // Convert date to ISO string for the dateTime attribute
              const isoDateString = fixtureDate.toISOString();
              
              return (
                <tr key={`desktop-${fixture.fixture_mid}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <time dateTime={isoDateString}>
                      {formattedDate} {formattedTime}
                    </time>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fixture.competition_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fixture.fixture_round}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fixture.home_team}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fixture.away_team}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link 
                      href={`/fixtures/${fixture.fixture_mid}`}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label={`View details for ${fixture.home_team} vs ${fixture.away_team}`}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile Card View (Visible only on small screens) */}
        <div className="sm:hidden">
          {fixtures.map((fixture) => {
            // Format the date for display
            const fixtureDate = new Date(fixture.fixture_datetime);
            const formattedDate = fixtureDate.toLocaleDateString();
            const formattedTime = fixtureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // Convert date to ISO string for the dateTime attribute
            const isoDateString = fixtureDate.toISOString();
            
            return (
              <div 
                key={`mobile-${fixture.fixture_mid}`} 
                className="bg-blue-50 py-5 border-b border-gray-300 space-y-3 px-4"
              >
                <div className="flex justify-between items-center">
                  <time dateTime={isoDateString} className="text-sm font-medium text-gray-900">
                    {formattedDate} {formattedTime}
                  </time>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {fixture.competition_name}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-1 justify-center items-center">
                  <div className="text-md font-medium text-gray-900">{fixture.home_team}</div>
                  <div className="text-xs text-gray-500">vs</div>
                  <div className="text-md font-medium text-gray-900">{fixture.away_team}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Round: {fixture.fixture_round}
                  </div>
                  <Link 
                    href={`/fixtures/${fixture.fixture_mid}`}
                    className="text-sm text-blue-600 hover:text-blue-900 font-medium"
                    aria-label={`View details for ${fixture.home_team} vs ${fixture.away_team}`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}