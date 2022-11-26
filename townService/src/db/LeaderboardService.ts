import { ScoreModel } from '../types/CoveyTownSocket';
import { addScore, removeScore, findScore, updateScore, getTodaysScores } from './LeaderboardDAO';

export async function getLeaders(numResults: number): Promise<ScoreModel[]> {
  const scores: ScoreModel[] = await getTodaysScores();
  if (numResults > 10 || numResults < 1) {
    throw new Error('Invalid number of results inputted for leaderboard');
  }
  const retScores = scores.slice(0, numResults);
  const sortedScores = retScores.sort((a: ScoreModel, b: ScoreModel): number => {
    if (a.score - b.score !== 0) {
      return a.score - b.score;
    }
    return Number(a.usedHint) - Number(b.usedHint);
  });
  return sortedScores;
}
export async function insertScore(newScore: ScoreModel): Promise<ScoreModel> {
  const createdScore = await addScore(newScore);
  return createdScore;
}

export async function removeScoreFromLeaderboard(teamName: string): Promise<ScoreModel> {
  const score = await removeScore(teamName);
  return score;
}

export async function findScoreByID(teamName: string): Promise<ScoreModel> {
  const scoreFound = await findScore(teamName);
  return scoreFound;
}

export async function updateScoreValue(newScore: ScoreModel): Promise<ScoreModel> {
  const updatedScore = await updateScore(newScore);
  return updatedScore;
}
