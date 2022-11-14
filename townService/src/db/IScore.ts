import mongoose from 'mongoose';

export interface IScore extends mongoose.Document {
  teamName: string;

  date?: Date;

  score: number;

  teamMembers: string[];

  usedHint?: boolean;

  finished?: boolean;
}
