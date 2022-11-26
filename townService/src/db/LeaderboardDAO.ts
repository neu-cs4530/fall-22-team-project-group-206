import { ScoreModel } from '../types/CoveyTownSocket';
import Score from './ScoreModel';

/**
 * Adds a new score to the database
 * @param newScore the new score being added
 * @returns the score that was created
 */
export async function addScore(newScore: ScoreModel): Promise<ScoreModel> {
  const mongooseDocument = new Score(newScore);
  const doc = await Score.create(mongooseDocument);
  if (doc === undefined) {
    throw new Error('Error creating message, database returned undefined.');
  }
  const createdScore: ScoreModel = {
    teamName: doc.teamName,
    score: doc.score,
    teamMembers: doc.teamMembers,
    usedHint: doc.usedHint,
  };
  return createdScore;
}

export async function removeScore(name: string): Promise<ScoreModel> {
  const doc = await Score.findOneAndDelete({ teamName: name });
  if (doc === null || doc === undefined) {
    throw new Error('Error removing score, database returned null or undefined');
  }
  const removedScore: ScoreModel = {
    teamName: doc.teamName,
    score: doc.score,
    teamMembers: doc.teamMembers,
    usedHint: doc.usedHint,
  };
  return removedScore;
}


export async function findScore(name: string): Promise<ScoreModel> {
  const doc = await Score.findOne({ teamName: name });
  if (doc === null || doc === undefined) {
    throw new Error('Error finding score, database returned null or undefined');
  }
  const foundScore: ScoreModel = {
    teamName: doc.teamName,
    score: doc.score,
    teamMembers: doc.teamMembers,
    usedHint: doc.usedHint,
  };
  return foundScore;
}


export async function updateScore(newScore: ScoreModel): Promise<ScoreModel> {
  const mongooseDocument = new Score(newScore);
  const doc = await Score.findOneAndUpdate({ teamName: newScore.teamName }, mongooseDocument);
  if (doc === null || doc === undefined) {
    throw new Error('Error updating score, database returned null or undefined');
  }
  const updatedScore: ScoreModel = {
    teamName: doc.teamName,
    score: doc.score,
    teamMembers: doc.teamMembers,
    usedHint: doc.usedHint,
  };
  return updatedScore;
}

export async function getScores(): Promise<ScoreModel[]> {
  const docs = await Score.find();
  if (docs === null || docs === undefined) {
    throw new Error('Error finding scores, database returned null or undefined');
  }
  const scoreModels: ScoreModel[] = [];
  docs.forEach(doc => {
    scoreModels.push({
      teamName: doc.teamName,
      score: doc.score,
      teamMembers: doc.teamMembers,
      usedHint: doc.usedHint,
    });
  });
  return scoreModels;
}
