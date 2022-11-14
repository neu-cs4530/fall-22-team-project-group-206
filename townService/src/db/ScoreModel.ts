import * as mongoose from 'mongoose';
import { IScore } from './IScore';

export const scoreSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  date: { type: Date, required: false, default: mongoose.now },
  score: { type: Number, required: true },
  teamMembers: { type: [String], required: true },
  usedHint: { type: Boolean, default: false },
  finished: { type: Boolean, default: false },
});

const score: mongoose.Model<IScore> = mongoose.model<IScore>('score', scoreSchema);

export default score;
