import * as mongoose from 'mongoose';
import { ScoreDoc } from './ScoreDoc';

export const scoreSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  date: { type: Date, required: false, default: new Date() },
  score: { type: Number, required: true },
  teamMembers: { type: [String], required: true },
  usedHint: { type: Boolean, required: true, default: false },
});

const score: mongoose.Model<ScoreDoc> = mongoose.model<ScoreDoc>('score', scoreSchema);

export default score;
