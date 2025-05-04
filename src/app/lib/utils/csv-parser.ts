import { parse } from 'csv-parse';
import { CSVFixture, Fixture } from '../models/fixture';

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

// Define a return type for the validation function
export type CSVStructureValidation = { 
  valid: boolean; 
  message?: string;
};

// Validate that the CSV has the required column structure
export function validateCSVStructure(firstRow: Record<string, string>): CSVStructureValidation {
  // Required fields that must be present in the CSV
  const requiredFields = [
    'fixture_mid', 
    'season', 
    'competition_name', 
    'fixture_datetime', 
    'fixture_round', 
    'home_team', 
    'away_team'
  ];
  
  // Check if all required fields exist in the CSV
  const missingFields = requiredFields.filter(field => !(field in firstRow));
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required columns: ${missingFields.join(', ')}`
    };
  }
  
  return { valid: true };
}

// Convert CSV fixture data to database model
export function transformCsvToFixture(csvFixture: CSVFixture): Fixture {
  try {
    // Add more robust parsing with error checking
    const season = parseInt(csvFixture.season);
    if (isNaN(season)) {
      throw new Error(`Invalid season value: ${csvFixture.season}`);
    }
    
    const fixtureDate = new Date(csvFixture.fixture_datetime);
    if (isNaN(fixtureDate.getTime())) {
      throw new Error(`Invalid date format: ${csvFixture.fixture_datetime}`);
    }
    
    const round = parseInt(csvFixture.fixture_round);
    if (isNaN(round)) {
      throw new Error(`Invalid round value: ${csvFixture.fixture_round}`);
    }
    
    if (!csvFixture.fixture_mid.trim()) {
      throw new Error('Fixture ID cannot be empty');
    }
    
    return {
      fixture_mid: csvFixture.fixture_mid.trim(),
      season: season,
      competition_name: csvFixture.competition_name.trim(),
      fixture_datetime: fixtureDate,
      fixture_round: round,
      home_team: csvFixture.home_team.trim(),
      away_team: csvFixture.away_team.trim(),
    };
  } catch (error) {
    // Rethrow the error to be caught by the caller
    throw error;
  }
}