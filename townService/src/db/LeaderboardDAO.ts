import Score from './ScoreModel';
import { IScore } from './IScore';

/**
 * Adds a new score to the database
 * @param newScore the new score being added
 * @returns the score that was created
 */
export async function addScore(newScore: IScore): Promise<IScore | undefined> {
  const doc = await newScore.save();
  return doc;
}

/**
 * Removes a score from the database
 * @param name the teamName associated with the score being removed
 * @returns the removed score
 */
export async function removeScore(name: string): Promise<IScore | null | undefined> {
  const doc = await Score.findOneAndDelete({ teamName: name });
  return doc;
}

/**
 * Finds a score in the database
 * @param name the teamName of the score being queried
 * @returns the score with the matching team name
 */
export async function findScore(name: string): Promise<IScore | null | undefined> {
  const doc = await Score.findOne({ teamName: name });
  return doc;
}

/**
 * Updates a score within the databse
 * @param newScore the new score, will update the score with a matching name
 * @returns the updated doc
 */
export async function updateScore(newScore: IScore): Promise<IScore | null | undefined> {
  const doc = await Score.findOneAndUpdate({ teamName: newScore.teamName }, newScore);
  return doc;
}

/**
 * Gets all the scores in the database
 * @returns All the scores in the databse
 */
export async function getScores(): Promise<IScore[] | null | undefined> {
  const docs = await Score.find();
  return docs;
}
