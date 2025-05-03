import { parse } from 'csv-parse';
import { CSVFixture, Fixture } from '../definitions';

export function parseCSVBuffer(buffer: Buffer): Promise<CSVFixture[]> {
  return new Promise((resolve, reject) => {
    const results: CSVFixture[] = [];
    
    // Create the parser
    const parser = parse({
      delimiter: ',',
      columns: true,
      skip_empty_lines: true,
    });

    // Use the readable stream API
    parser.on('readable', function() {
      let record;
      while ((record = parser.read()) !== null) {
        results.push(record);
      }
    });

    // Catch any error
    parser.on('error', function(err) {
      reject(err);
    });

    // When we are done, resolve the promise with the results
    parser.on('end', function() {
      resolve(results);
    });

    // Write data to the stream
    parser.write(buffer.toString());
    parser.end();
  });
}

// Convert CSV fixture data to database model
export function transformCsvToFixture(csvFixture: CSVFixture): Fixture {
  return {
    fixture_mid: csvFixture.fixture_mid,
    season: parseInt(csvFixture.season),
    competition_name: csvFixture.competition_name,
    fixture_datetime: new Date(csvFixture.fixture_datetime),
    fixture_round: parseInt(csvFixture.fixture_round),
    home_team: csvFixture.home_team,
    away_team: csvFixture.away_team,
  };
}