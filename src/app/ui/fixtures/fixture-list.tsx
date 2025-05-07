import { Fixture } from '@/app/lib/models/fixture';
import { DeleteFixtureButton, ViewDetailsButton } from './buttons';
import { FixtureTableContainer, FixtureTableHeader } from './fixture-table-components';

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
    <>
      {/* Desktop Table View (Hidden on small screens) */}
      <FixtureTableContainer>
        <FixtureTableHeader />
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
                  <div className="flex items-center space-x-2">
                    <ViewDetailsButton 
                      id={fixture.fixture_mid} 
                      teamNames={`${fixture.home_team} vs ${fixture.away_team}`}
                      compact={true} 
                    />
                    <DeleteFixtureButton id={fixture.fixture_mid} compact={true} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </FixtureTableContainer>

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
                <div className="flex items-center space-x-2">
                  <ViewDetailsButton 
                    id={fixture.fixture_mid} 
                    teamNames={`${fixture.home_team} vs ${fixture.away_team}`}
                    compact={true} 
                  />
                  <DeleteFixtureButton id={fixture.fixture_mid} compact={true} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}