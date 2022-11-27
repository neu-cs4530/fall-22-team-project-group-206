import mongoose from 'mongoose';

/**
 * Represents the documents found within the MongoDB collections for Scores.
 */
export interface ScoreDoc extends mongoose.Document {
  teamName: string;

  date?: Date;

  score: number;

  teamMembers: string[];

  usedHint: boolean;
}
