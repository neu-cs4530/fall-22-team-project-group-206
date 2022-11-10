import Score, { ScoreModel } from './ScoreModel';
import { IScore } from './IScore';
import { addScore, removeScore, findScore, updateScore, getScores } from './LeaderboardDAO';

export async function getLeaders(numResults: number): Promise<IScore[]> {
  let scores: IScore[] | undefined | null = await getScores();
  if (scores === undefined || scores === null) {
    Error(`Leaderboard scores returned: ${scores}. No scores available.`);
  }
  if (scores !== undefined && scores !== null && numResults > scores.length) {
    Error(`Only ${scores.length} scores recorded.`);
  }
  scores = scores as IScore[];
  const retScores = scores.slice(0, numResults);
  return retScores;
}
export async function insertScore(newScore: ScoreModel): Promise<IScore> {
  const newScoreReal = new Score({
    teamName: newScore.teamName,
    score: newScore.score,
    teamMembers: newScore.teamMembers,
  });
  let createdScore = await addScore(newScoreReal);
  if (createdScore === undefined) {
    Error(`Score with name ${newScore.teamName} not found`);
  }
  createdScore = createdScore as IScore;
  return createdScore;
}

export async function removeScoreFromLeaderboard(teamName: string): Promise<IScore> {
  const doc = await removeScore(teamName);
  if (doc === undefined || doc === null) {
    Error(`Score with name ${teamName} not found`);
  }
  return doc as IScore;
}

export async function findScoreByID(teamName: string): Promise<IScore> {
  const scoreFound = await findScore(teamName);
  if (scoreFound === undefined || scoreFound === null) {
    Error(`Score with name ${teamName} not found`);
  }
  return scoreFound as IScore;
}

export async function updateScoreValue(newScore: ScoreModel): Promise<IScore> {
  const newScoreDoc = new Score({
    teamName: newScore.teamName,
    score: newScore.score,
    teamMembers: newScore.teamMembers,
  });
  const updatedScore = await updateScore(newScoreDoc);
  if (updatedScore === null && updatedScore === undefined) {
    Error(`Score with name ${newScore.teamName} not found`);
  }
  return updatedScore as IScore;
}

export async function getAllScores(): Promise<IScore[]> {
  const scores: IScore[] | undefined | null = await getScores();
  if (scores === undefined || scores === null) {
    Error(`No Scores found`);
  }
  return scores as IScore[];
}
