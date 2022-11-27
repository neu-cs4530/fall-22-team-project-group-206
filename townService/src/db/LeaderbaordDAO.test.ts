import { addScore, removeScore, findScore, updateScore, getTodaysScores } from './LeaderboardDAO';
import Score from './ScoreModel';

// This module can only be imported with require,
// that is why we had to disable lint to allow it to still build
// eslint-disable-next-line
const mockingoose = require('mockingoose');

describe('LeaderboardDAO', () => {
  const testScore = { teamName: 'name', score: 50, teamMembers: ['jaime'] };
  describe('findScore', () => {
    it('calls the findOne method in mongoose', async () => {
      mockingoose(Score).toReturn(testScore, 'findOne');
      const returnedScore = await findScore(testScore.teamName);
      expect(returnedScore?.teamName).toEqual(testScore.teamName);
      expect(returnedScore?.teamMembers).toEqual(testScore.teamMembers);
      expect(returnedScore?.score).toEqual(testScore.score);
    });
    it('throws an error when findOne is undefined', async () => {
      mockingoose(Score).toReturn(undefined, 'findOne');
      await expect(async () => {
        await findScore(testScore.teamName);
      }).rejects.toThrowError();
    });
  });
  describe('updateScore', () => {
    it('calls the findOneAndUpdate method in mongoose', async () => {
      mockingoose(Score).toReturn(testScore, 'findOneAndUpdate');
      const returnedScore = await updateScore(new Score(testScore));
      expect(returnedScore?.teamName).toEqual(testScore.teamName);
      expect(returnedScore?.teamMembers).toEqual(testScore.teamMembers);
      expect(returnedScore?.score).toEqual(testScore.score);
    });
  });
  describe('removeScore', () => {
    it('calls the remove method in mongoose', async () => {
      mockingoose(Score).toReturn(testScore, 'findOneAndDelete');
      const returnedScore = await removeScore('name');
      expect(returnedScore?.teamName).toEqual(testScore.teamName);
      expect(returnedScore?.teamMembers).toEqual(testScore.teamMembers);
      expect(returnedScore?.score).toEqual(testScore.score);
    });
    it('throws an error when removeScore returns undefined', async () => {
      mockingoose(Score).toReturn(undefined, 'findOneAndDelete');
      await expect(async () => {
        await removeScore('test');
      }).rejects.toThrowError();
    });
    it('throws an error when removeScore returns null', async () => {
      mockingoose(Score).toReturn(null, 'findOneAndDelete');
      await expect(async () => {
        await removeScore('test');
      }).rejects.toThrowError();
    });
  });

  describe('getScores', () => {
    it('calls the find method in mongoose', async () => {
      mockingoose(Score).toReturn([testScore], 'find');
      const returnedScores = await getTodaysScores();
      expect(returnedScores).not.toBeUndefined();
      expect(returnedScores).not.toBeNull();
      expect(returnedScores?.length).toBe(1);
    });
    it('throws an error when getScores returns undefined', async () => {
      mockingoose(Score).toReturn(undefined, 'find');
      await expect(async () => {
        await getTodaysScores();
      }).rejects.toThrowError();
    });
    it('throws an error when getScores returns null', async () => {
      mockingoose(Score).toReturn(undefined, 'find');
      await expect(async () => {
        await getTodaysScores();
      }).rejects.toThrowError();
    });
  });
  describe('addScore', () => {
    it('calls the save method in mongoose', async () => {
      mockingoose(Score).toReturn(testScore, 'save');
      const returnedScore = await addScore(new Score(testScore));
      expect(returnedScore?.teamName).toEqual(testScore.teamName);
      expect(returnedScore?.teamMembers).toEqual(testScore.teamMembers);
      expect(returnedScore?.score).toEqual(testScore.score);
    });
  });
});
