import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// ===== 1. Zod Schema (for validation and type generation) =====
export const FixtureSchema = z.object({
  fixture_mid: z.string(),
  season: z.number(),
  competition_name: z.string(),
  fixture_datetime: z.union([z.string(), z.date(), z.instanceof(Date)]),
  fixture_round: z.number(),
  home_team: z.string(),
  away_team: z.string(),
}).strip(); // Automatically removes MongoDB fields like _id and __v

// Create an array schema for fixture lists
export const FixtureArraySchema = z.array(FixtureSchema);

// TypeScript types generated from Zod schema
export type Fixture = z.infer<typeof FixtureSchema>;
export type FixtureArray = z.infer<typeof FixtureArraySchema>;

// ===== 2. Mongoose Schema (for database operations) =====
const fixtureSchema = new Schema({
  fixture_mid: { 
    type: String, 
    required: true,
    unique: true
  },
  season: { 
    type: Number, 
    required: true 
  },
  competition_name: { 
    type: String, 
    required: true 
  },
  fixture_datetime: { 
    type: Date, 
    required: true 
  },
  fixture_round: { 
    type: Number, 
    required: true 
  },
  home_team: { 
    type: String, 
    required: true 
  },
  away_team: { 
    type: String, 
    required: true 
  },
});

// Create index for search functionality on team names
fixtureSchema.index({ home_team: 'text', away_team: 'text' });

// Export Mongoose model
export const FixtureModel = mongoose.models.Fixture || mongoose.model('Fixture', fixtureSchema);

// ===== 3. Additional Types =====
// Define the CSV input type
export type CSVFixture = {
  fixture_mid: string;
  season: string;
  competition_name: string;
  fixture_datetime: string;
  fixture_round: string;
  home_team: string;
  away_team: string;
};