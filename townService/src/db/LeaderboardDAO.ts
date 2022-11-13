import Score from './ScoreModel';
import { IScore } from './IScore';

export async function addScore(newScore: IScore): Promise<IScore | undefined> {
  const doc = await Score.create(newScore);
  return doc;
}

export async function removeScore(teamName: string): Promise<IScore | null | undefined> {
  const doc = await Score.findOneAndDelete((score: IScore) => score.teamName === teamName);
  return doc;
}

export async function findScore(teamName: string): Promise<IScore | null | undefined> {
  const doc = await Score.findOne((score: IScore) => score.teamName === teamName);
  return doc;
}

export async function updateScore(newScore: IScore): Promise<IScore | null | undefined> {
  const doc = await Score.findOne(
    (score: IScore) => score.teamName === newScore.teamName,
    newScore,
  );
  return doc;
}

export async function getScores(): Promise<IScore[] | null | undefined> {
  const docs = await Score.find();
  return docs;
}
