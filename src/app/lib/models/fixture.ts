import mongoose, { Schema } from 'mongoose';

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

// Check if model exists to prevent overwriting in development with hot reloading
export const Fixture = mongoose.models.Fixture || mongoose.model('Fixture', fixtureSchema);