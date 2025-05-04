'use server'

import { connectToDatabase } from '../utils/db';
import { parseCSVBuffer, transformCsvToFixture, validateCSVStructure } from '../utils/csv-parser';
import { FixtureModel, FixtureSchema, CSVFixture, Fixture } from '../models/fixture';
import { revalidatePath } from 'next/cache';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

// Define error types
export type ValidationErrorFormat = {
  _errors?: string[];
  [key: string]: ValidationErrorFormat | string[] | undefined;
};

// Define the invalid fixture record type
type InvalidFixtureRecord = {
  rowNumber: number;
  data: CSVFixture;
  errors: ValidationErrorFormat;
};

// Define type for MongoDB error with code and writeErrors
interface MongoDbError extends Error {
  code?: number;
  writeErrors?: Array<{ index: number; code: number; errmsg: string }>;
}

export async function uploadCSV(formData: FormData) {
  try {
    // Get file from the formData
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, message: 'No file uploaded' };
    }

    // Check file type
    if (file.name.split('.').pop()?.toLowerCase() !== 'csv') {
      return { success: false, message: 'Please upload a CSV file' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    // Parse the CSV data
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const csvData = await parseCSVBuffer(buffer);

      if (csvData.length === 0) {
        return { success: false, message: 'No data found in the CSV file' };
      }

      // Validate CSV structure
      const structureValidation = validateCSVStructure(csvData[0]);
      if (!structureValidation.valid) {
        return {
          success: false,
          message: `Invalid CSV structure: ${structureValidation.message}`
        };
      }

      // Connect to the database
      await connectToDatabase();

      // Transform and validate the fixtures using our domain model schema
      const fixtures: Fixture[] = [];
      const invalidFixtures: InvalidFixtureRecord[] = [];

      csvData.forEach((csvFixture, index) => {
        try {
          const fixture = transformCsvToFixture(csvFixture);
          const validation = FixtureSchema.safeParse(fixture);

          if (validation.success) {
            fixtures.push(validation.data);
          } else {
            invalidFixtures.push({
              rowNumber: index + 2, // +2 because of 0-index and header row
              data: csvFixture,
              errors: validation.error.format() as ValidationErrorFormat
            });
          }
        } catch (transformError) {
          // Handle errors in the transformation process
          invalidFixtures.push({
            rowNumber: index + 2,
            data: csvFixture,
            errors: { _errors: [`Error transforming data: ${transformError instanceof Error ? transformError.message : 'Unknown error'}`] }
          });
        }
      });

      if (fixtures.length === 0) {
        return {
          success: false,
          message: 'No valid fixtures found in the CSV file',
          invalidRecords: invalidFixtures.slice(0, 10) // Return first 10 invalid records
        };
      }

      // Database insertion stats
      const dbResults = {
        inserted: 0,
        duplicates: 0,
        failed: 0
      };

      // Use insertMany with ordered: false to continue inserting even if some fail
      try {
        await FixtureModel.insertMany(fixtures, { ordered: false });
        dbResults.inserted = fixtures.length;
      } catch (error) {
        // Type check the error before accessing properties
        const e = error as MongoDbError;

        // Handle duplicate key errors (still consider operation successful)
        if (e.code === 11000) {
          const writeErrors = e.writeErrors || [];
          dbResults.duplicates = writeErrors.length;
          dbResults.inserted = fixtures.length - writeErrors.length;
        } else {
          throw error;
        }
      }

      // Revalidate fixtures page to show latest data
      revalidatePath('/fixtures');

      // Build detailed result message
      let resultMessage = `Successfully processed ${fixtures.length} fixtures.`;

      if (invalidFixtures.length > 0) {
        resultMessage += ` ${invalidFixtures.length} fixtures were invalid.`;
      }

      if (dbResults.duplicates > 0) {
        resultMessage += ` ${dbResults.duplicates} fixtures were duplicates and skipped.`;
      }

      return {
        success: true,
        message: resultMessage,
        count: dbResults.inserted,
        duplicates: dbResults.duplicates,
        invalidCount: invalidFixtures.length,
        // Provide sample of invalid records for debugging (limit to first 10)
        invalidRecords: invalidFixtures.length > 0 ? invalidFixtures.slice(0, 10) : undefined
      };
    } catch (parseError) {
      // Handle CSV parsing errors specifically
      return {
        success: false,
        message: `Error parsing CSV: ${parseError instanceof Error ? parseError.message : 'Invalid CSV format'}`
      };
    }
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: `Error processing CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}