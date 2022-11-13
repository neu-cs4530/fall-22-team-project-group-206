import Score from './ScoreModel';
import { IScore } from './IScore';

export async function addScore(newScore: IScore): Promise<IScore | undefined> {
  const doc = await Score.create(newScore);
  return doc;
}

export async function removeScore(name: string): Promise<IScore | null | undefined> {
  const doc = await Score.findOneAndDelete({ teamName: name });
  return doc;
}

export async function findScore(name: string): Promise<IScore | null | undefined> {
  const doc = await Score.findOne({ teamName: name });
  return doc;
}

export async function updateScore(newScore: IScore): Promise<IScore | null | undefined> {
  const doc = await Score.findOneAndUpdate({ teamName: newScore.teamName }, newScore);
  return doc;
}

export async function getScores(): Promise<IScore[] | null | undefined> {
  const docs = await Score.find();
  return docs;
}
