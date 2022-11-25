import { ScoreModel } from '../types/CoveyTownSocket';
import { addScore, removeScore, findScore, updateScore, getScores } from './LeaderboardDAO';

export async function getLeaders(numResults: number): Promise<ScoreModel[]> {
  let scores: ScoreModel[] = await getScores();
  const retScores = scores.slice(0, numResults);
  return retScores;
}
export async function insertScore(newScore: ScoreModel): Promise<ScoreModel> {
  let createdScore = await addScore(newScore);
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

export async function getAllScores(): Promise<ScoreModel[]> {
  const scores: ScoreModel[] = await getScores();
  return scores;
}
