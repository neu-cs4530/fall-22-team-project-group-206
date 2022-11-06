import { Int32 } from 'mongodb';
import { IScore } from './IScore';
import * as mongoose from 'mongoose';


export const ScoreSchema = new mongoose.Schema({

    teamName: { type: String, required: true },
    date: { type: Date, required: true },
    score: { type: Int32, required: true},
    teamMembers: { type: [String], required: true},
    usedHint: { type: Boolean, default: false},
    finished: { type: Boolean, default: false}
  
  });
  
  const Score: mongoose.Model<IScore> = mongoose.model<IScore>('Score', ScoreSchema);
  
  
  export default Score;