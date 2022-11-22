import { addScore, removeScore, findScore, updateScore, getScores } from './LeaderboardDAO';
import Score from './ScoreModel';
import { IScore } from './IScore';
import { ScoreModel } from '../types/CoveyTownSocket';

// This module can only be imported with require,
// that is why we had to disable lint to allow it to still build
// eslint-disable-next-line
const mockingoose = require('mockingoose');

jest.setTimeout(30000)
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
  });

  describe('getScores', () => {
    it('calls the find method in mongoose', async () => {
      mockingoose(Score).toReturn([testScore], 'find');
      const returnedScores = await getScores();
      expect(returnedScores).not.toBeUndefined();
      expect(returnedScores).not.toBeNull();
      expect(returnedScores?.length).toBe(1);
    });
  });
  describe('findScore', () => {
    it('calls the findOne method in mongoose', async () => {
      mockingoose(Score).toReturn(testScore, 'findOne');
      const returnedScore = await findScore(testScore.teamName);
      expect(returnedScore?.teamName).toEqual(testScore.teamName);
      expect(returnedScore?.teamMembers).toEqual(testScore.teamMembers);
      expect(returnedScore?.score).toEqual(testScore.score);
    });
  });
  describe('addScore', () => {
    it('calls the create method in mongoose', async () => {
      mockingoose(Score).toReturn(testScore, 'save');
      const returnedScore = await addScore(new Score(testScore));
      expect(returnedScore?.teamName).toEqual(testScore.teamName);
      expect(returnedScore?.teamMembers).toEqual(testScore.teamMembers);
      expect(returnedScore?.score).toEqual(testScore.score);
    });
  });

});
