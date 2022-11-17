import Score from './ScoreModel';
import { ScoreModel } from '../types/CoveyTownSocket';
import { IScore } from './IScore';
import { addScore, removeScore, findScore, updateScore, getScores } from './LeaderboardDAO';

/**
 * gets the top number amount of scores. If there are less scores than the inputted number, all scores are returned.
 * @param numResults
 * @returns
 */
export async function getLeaders(numResults: number): Promise<IScore[]> {
  let scores: IScore[] | undefined | null = await getScores();
  if (scores === undefined || scores === null) {
    throw new Error(`Leaderboard scores returned: ${scores}. No scores available.`);
  }
  if (numResults < 1 || numResults > 10) {
    throw new Error('Must request at least one value from leaderboard and less than 10.');
  }
  scores = scores as IScore[];
  const sortedRetScores = scores.sort((a: IScore, b: IScore) => a.score - b.score);
  const retScores = sortedRetScores.slice(0, numResults);
  return retScores;
}

export async function insertScore(newScore: ScoreModel): Promise<IScore> {
  const newScoreReal = new Score({
    teamName: newScore.teamName,
    score: newScore.score,
    teamMembers: newScore.teamMembers,
    usedHint: newScore.usedHint,
  });
  let createdScore = await addScore(newScoreReal);
  if (createdScore === undefined) {
    throw new Error(`Score with name ${newScore.teamName} not found`);
  }
  createdScore = createdScore as IScore;
  return createdScore;
}

export async function removeScoreFromLeaderboard(teamName: string): Promise<IScore> {
  const doc = await removeScore(teamName);
  if (doc === undefined || doc === null) {
    throw new Error(`Score with name ${teamName} not found`);
  }
  return doc as IScore;
}

export async function findScoreByID(teamName: string): Promise<IScore> {
  const scoreFound = await findScore(teamName);
  if (scoreFound === undefined || scoreFound === null) {
    throw new Error(`Score with name ${teamName} not found`);
  }
  return scoreFound as IScore;
}

export async function updateScoreValue(newScore: ScoreModel): Promise<IScore> {
  const newScoreDoc = new Score({
    teamName: newScore.teamName,
    score: newScore.score,
    teamMembers: newScore.teamMembers,
    usedHint: newScore.usedHint,
  });
  const updatedScore = await updateScore(newScoreDoc);
  if (updatedScore === null || updatedScore === undefined) {
    throw new Error(`Score with team name ${newScore.teamName} not found`);
  }
  return updatedScore as IScore;
}
