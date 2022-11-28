import { ScoreModel } from '../types/CoveyTownSocket';
import Score from './ScoreModel';

/**
 * Adds a new score to the database
 * @param newScore the new score being added
 * @returns a scoremodel representing the added score
 */
export async function addScore(newScore: ScoreModel): Promise<ScoreModel> {
  const mongooseDocument = new Score(newScore);
  const doc = await mongooseDocument.save();
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

/**
 * Removes a score from the database.
 * @param name The team name of the score being removed from the database.
 * @returns A scoremodel representing the removed score.
 */
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

/**
 * Finds a score within the database
 * @param name The name of the queried score.
 * @returns A score model representing the queried score.
 */
export async function findScore(name: string): Promise<ScoreModel> {
  const doc = await Score.findOne({ teamName: name });
  if (doc === null) {
    throw new Error('Error finding score, database returned null');
  }
  if (doc === undefined) {
    throw new Error('Error finding score, database returned undefined');
  }
  const foundScore: ScoreModel = {
    teamName: doc.teamName,
    score: doc.score,
    teamMembers: doc.teamMembers,
    usedHint: doc.usedHint,
  };
  return foundScore;
}

/**
 * Updates a score within the database.
 * @param newScore The score with the updated values, must match the team name of a current score in the db.
 * @returns A score model representing the old score.
 */
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

/**
 * Returns all the scores from today found within the database.
 * @returns A list of score models that each represent a score from the present day.
 */
export async function getTodaysScores(): Promise<ScoreModel[]> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // The database should do a reset every day but just in case this is in place
  const docs = await Score.find({ date: { $gte: startOfToday } });
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

/**
 * Returns all the scores from today found within the database.
 * @returns A list of score models that each represent a score from the present day.
 */
export async function isTeamNameInUse(teamName: string): Promise<boolean> {
  // The database should do a reset every day but just in case this is in place
  const docs = await Score.find({ teamName: { $eq: teamName } });
  if (docs === null || docs === undefined) {
    throw new Error('Error finding scores, database returned undefined');
  }
  
  return docs.length > 0;
}



