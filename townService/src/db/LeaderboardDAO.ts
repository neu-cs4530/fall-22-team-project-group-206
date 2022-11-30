import { ScoreModel } from '../types/CoveyTownSocket';
import Score from './ScoreModel';
import { NotFoundError, UndefinedError } from './DatabaseErrors';

/**
 * Adds a new score to the database
 * @param newScore the new score being added
 * @returns a scoremodel representing the added score
 */
export async function addScore(newScore: ScoreModel): Promise<ScoreModel> {
    const doc = await Score.create(newScore);
    if (doc === undefined) {
      throw new UndefinedError('Error creating message, database returned undefined.');
    }
    if (doc === null) {
      throw new NotFoundError('Error creating message, database returned null');
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
 * Returns all the scores from today found within the database.
 * @returns A list of score models that each represent a score from the present day.
 */
export async function getTodaysScores(): Promise<ScoreModel[]> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // The database should do a reset every day but just in case this is in place
  const docs = await Score.find({ date: { $gte: startOfToday } });
  if (docs === null) {
    throw new UndefinedError('Error finding scores, database returned null');
  }
  if (docs === undefined ){
    throw new NotFoundError('Error finding scores, database returned undefined');
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
export async function numInstancesTeamNameUsed(teamName: string): Promise<number> {
  // the database clears all scores daily, so this will only check team names created in the past day
  const num = await Score.count({ teamName: { $eq: teamName } });
  if (num === undefined) {
    throw new UndefinedError('Error parsing number of teams, database returned undefined');
  }

  return num;
}
