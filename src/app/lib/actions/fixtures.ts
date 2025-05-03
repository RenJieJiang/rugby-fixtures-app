'use server'

import { connectToDatabase } from '../utils/db';
import { Fixture } from '../models/fixture';

export async function searchFixtures(query: string) {
  try {
    await connectToDatabase();
    
    if (!query || query.trim() === '') {
      // Return all fixtures if no query
      const fixtures = await Fixture.find({})
        .sort({ fixture_datetime: 1 })
        .limit(50)
        .lean();
      return { success: true, fixtures };
    }

    // Search by team name (either home or away)
    const fixtures = await Fixture.find({
      $or: [
        { home_team: { $regex: query, $options: 'i' } },
        { away_team: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ fixture_datetime: 1 })
    .lean();

    return { success: true, fixtures };
  } catch (error) {
    console.error('Search error:', error);
    return { 
      success: false, 
      message: `Error searching fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function getFixture(id: string) {
  try {
    await connectToDatabase();
    
    const fixture = await Fixture.findOne({ fixture_mid: id }).lean();
    
    if (!fixture) {
      return { success: false, message: 'Fixture not found' };
    }
    
    return { success: true, fixture };
  } catch (error) {
    console.error('Get fixture error:', error);
    return { 
      success: false, 
      message: `Error retrieving fixture: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}