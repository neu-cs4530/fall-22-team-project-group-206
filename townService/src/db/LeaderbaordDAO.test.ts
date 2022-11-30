import { addScore, getTodaysScores, numInstancesTeamNameUsed } from './LeaderboardDAO';
import Score from './ScoreModel';
/* eslint-disable */
describe('LeaderboardDAO', () => {
  const testScore = { teamName: 'name', score: 50, teamMembers: ['jaime'], usedHint: false };
  describe('getScores', () => {
    it('calls the find method in mongoose', async () => {
      //eslint
      jest.spyOn(Score, 'find').mockReturnValueOnce([testScore] as any);
      const returnedScores = await getTodaysScores();
      expect(returnedScores).not.toBeUndefined();
      expect(returnedScores).not.toBeNull();
      expect(returnedScores?.length).toBe(1);
    });
    it('throws an error when getScores returns undefined', async () => {
      jest.spyOn(Score, 'find').mockReturnValueOnce(undefined as any);
      await expect(async () => {
        await getTodaysScores();
      }).rejects.toThrowError();
    });
    it('throws an error when getScores returns null', async () => {
      jest.spyOn(Score, 'find').mockReturnValueOnce(null as any);
      await expect(async () => {
        await getTodaysScores();
      }).rejects.toThrowError();
    });
  });
  describe('addScore', () => {
    it('calls the create method in mongoose', async () => {
      jest.spyOn(Score, 'create').mockReturnValueOnce(testScore as any);
      const returnedScore = await addScore(testScore);
      expect(returnedScore.teamName).toEqual(testScore.teamName);
      expect(returnedScore.teamMembers).toEqual(testScore.teamMembers);
      expect(returnedScore.score).toEqual(testScore.score);
    });
    it('throws an error when create returns null', async () => {
      jest.spyOn(Score, 'create').mockReturnValueOnce(null as any);
      await expect(async () => {
        await addScore(testScore);
      }).rejects.toThrowError();
    });
    it('throws an error when create returns undefined', async () => {
      jest.spyOn(Score, 'create').mockReturnValueOnce(undefined as any);
      await expect(async () => {
        await addScore(testScore);
      }).rejects.toThrowError();
    });
  });

  describe('numInstancesTeamNameUsed', () => {
    it('calls the count method in mongoose', async () => {
      jest.spyOn(Score, 'count').mockReturnValueOnce(0 as any);
      const returnedNum = await numInstancesTeamNameUsed(testScore.teamName);
      expect(returnedNum).toEqual(0);
    });
    it('calls the count method in mongoose', async () => {
      jest.spyOn(Score, 'count').mockReturnValueOnce(5 as any);
      const returnedNum = await numInstancesTeamNameUsed(testScore.teamName);
      expect(returnedNum).toEqual(5);
    });
    it('throws an error when count returns undefined', async () => {
      jest.spyOn(Score, 'count').mockReturnValueOnce(undefined as any);
      await expect(async () => {
        await numInstancesTeamNameUsed(testScore.teamName);
      }).rejects.toThrowError();
    });
  });
});
