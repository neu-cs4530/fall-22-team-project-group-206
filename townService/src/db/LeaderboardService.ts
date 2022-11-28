import { ScoreModel } from '../types/CoveyTownSocket';
import {
  addScore,
  removeScore,
  findScore,
  updateScore,
  getTodaysScores,
  isTeamNameInUse,
} from './LeaderboardDAO';

/**
 * Returns the leaders for todays crossword puzzle.
 * @param numResults the size of the leaderboard
 * @returns a list of scoreModels the each represent a score from todays crossword
 */
export async function getLeaders(numResults: number): Promise<ScoreModel[]> {
  const scores: ScoreModel[] = await getTodaysScores();
  if (numResults > 10 || numResults < 1) {
    throw new Error('Invalid number of results inputted for leaderboard');
  }
  const sortedScores = scores.sort((a: ScoreModel, b: ScoreModel): number => {
    if (a.score - b.score !== 0) {
      return a.score - b.score;
    }
    return Number(a.usedHint) - Number(b.usedHint);
  });
  const retScores = sortedScores.slice(0, numResults);
  return retScores;
}

/**
 * Inserts a new score into the database
 * @param newScore the new score being inserted into the db
 * @returns a scoreModel representing the score added to the db
 */
export async function insertScore(newScore: ScoreModel): Promise<ScoreModel> {
  const createdScore = await addScore(newScore);
  return createdScore;
}

/**
 * Removes a score from the leaderboard
 * @param teamName the name of the score that needs to be removed
 * @returns the removed Score
 */
export async function removeScoreFromLeaderboard(teamName: string): Promise<ScoreModel> {
  const score = await removeScore(teamName);
  return score;
}

/**
 * Finds a score with the provided team name within the database
 * @param teamName the name of the team being queried
 * @returns a scoreModel representing the score found within the database
 */
export async function findScoreByID(teamName: string): Promise<ScoreModel> {
  const scoreFound = await findScore(teamName);
  return scoreFound;
}

/**
 * Updates the score matching the team name of the provided score within the db
 * @param newScore the new score to replace the score currently in the db
 * @returns a scoreModel representing the old score no longer in the db
 */
export async function updateScoreValue(newScore: ScoreModel): Promise<ScoreModel> {
  const updatedScore = await updateScore(newScore);
  return updatedScore;
}

/**
 * Evaluates if the team name is curreanly
 * @param teamName the name of the team being checked
 * @returns if the team name has been used toda
 */
export async function isTeamNameCurrentlyUsed(teamName: string): Promise<boolean> {
  const isUsed = await isTeamNameInUse(teamName);
  return isUsed;
}
