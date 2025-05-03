'use server'

import { connectToDatabase } from '../utils/db';
import { parseCSVBuffer, transformCsvToFixture } from '../utils/csv-parser';
import { Fixture } from '../models/fixture';
import { revalidatePath } from 'next/cache';

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

    // Parse the CSV data
    const buffer = Buffer.from(await file.arrayBuffer());
    const csvData = await parseCSVBuffer(buffer);
    
    if (csvData.length === 0) {
      return { success: false, message: 'No data found in the CSV file' };
    }

    // Connect to the database
    await connectToDatabase();

    // Transform and save the fixtures
    const fixtures = csvData.map(transformCsvToFixture);
    
    // Use insertMany with ordered: false to continue inserting even if some fail
    // ordered: false option allows to insert all valid documents even when duplicates are found
    await Fixture.insertMany(fixtures, { ordered: false })
      .catch(e => {
        // Handle duplicate key errors (still consider operation successful)
        if (e.code !== 11000) {
          throw e;
        }
      });

    // Revalidate fixtures page to show latest data
    revalidatePath('/fixtures');
    
    return {
      success: true,
      message: `Successfully processed ${fixtures.length} fixtures`,
      count: fixtures.length
    };
    
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      message: `Error processing CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}