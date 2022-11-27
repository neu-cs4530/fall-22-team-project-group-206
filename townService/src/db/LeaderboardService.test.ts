import { addScore, removeScore, findScore, updateScore, getTodaysScores } from './LeaderboardDAO';

import {
  getLeaders,
  insertScore,
  removeScoreFromLeaderboard,
  updateScoreValue,
  findScoreByID,
} from './LeaderboardService';
import { ScoreModel } from '../types/CoveyTownSocket';

jest.mock('./LeaderboardDAO', () => {
  const original = jest.requireActual('./LeaderboardDAO');
  return {
    __esModule: true,
    ...original,
    addScore: jest.fn(),
    removeScore: jest.fn(),
    findScore: jest.fn(),
    updateScore: jest.fn(),
    getTodaysScores: jest.fn(),
  };
});

const testScoreModel: ScoreModel = {
  teamName: 'test',
  score: 50,
  teamMembers: ['jaime', 'Shuhang'],
  usedHint: true,
};
const testScoreModel2: ScoreModel = {
  teamName: 'test2',
  score: 60,
  teamMembers: ['Frank', 'Jeremy'],
  usedHint: true,
};
const testScoreModelBest: ScoreModel = {
  teamName: 'test',
  score: 10,
  teamMembers: ['player1', 'player2'],
  usedHint: false,
};

const TEST_LEADERBOARD: ScoreModel[] = [testScoreModel, testScoreModel2, testScoreModelBest];
const addFunc = addScore as jest.Mock;
const getTodaysScoresFunc = getTodaysScores as jest.Mock;
const removeFunc = removeScore as jest.Mock;
const findFunc = findScore as jest.Mock;
const updateFunc = updateScore as jest.Mock;

describe('LeaderboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('InsertScore', () => {
    it('insert calls and modifies addScore', async () => {
      addFunc.mockImplementation(() => testScoreModel);
      const score = await insertScore(testScoreModel);
      expect(addScore).toBeCalledTimes(1);
      expect(score.teamName).toEqual(testScoreModel.teamName);
      expect(score.score).toEqual(testScoreModel.score);
      expect(score.teamMembers).toEqual(testScoreModel.teamMembers);
      expect(score.usedHint).toEqual(testScoreModel.usedHint);
    });
  });

  describe('getLeaders', () => {
    it('calls getScores and sorts list', async () => {
      getTodaysScoresFunc.mockImplementation(() => TEST_LEADERBOARD);
      const newLeaderboard = await getLeaders(3);
      expect(getTodaysScores).toBeCalledTimes(1);
      expect(newLeaderboard.length).toEqual(3);
      expect(newLeaderboard[0].teamName).toEqual(testScoreModelBest.teamName);
      expect(newLeaderboard[1].teamName).toEqual(testScoreModel.teamName);
      expect(newLeaderboard[2].teamName).toEqual(testScoreModel2.teamName);
    });
    it('calls getScores and only returns the alloted number', async () => {
      getTodaysScoresFunc.mockImplementation(() => TEST_LEADERBOARD);
      const newLeaderboard = await getLeaders(1);
      expect(getTodaysScores).toBeCalledTimes(1);
      expect(newLeaderboard.length).toEqual(1);
      expect(newLeaderboard[0].teamName).toEqual(testScoreModelBest.teamName);
    });
    it('calls getScores and returns all available if there are not enough scores', async () => {
      getTodaysScoresFunc.mockImplementation(() => TEST_LEADERBOARD);
      const newLeaderboard = await getLeaders(10);
      expect(getTodaysScores).toBeCalledTimes(1);
      expect(newLeaderboard.length).toEqual(3);
      expect(newLeaderboard[0].teamName).toEqual(testScoreModelBest.teamName);
      expect(newLeaderboard[1].teamName).toEqual(testScoreModel.teamName);
      expect(newLeaderboard[2].teamName).toEqual(testScoreModel2.teamName);
    });

    it('throws an error when a value less than 1 is inputted', async () => {
      getTodaysScoresFunc.mockImplementation(() => 'response');
      await expect(async () => {
        await getLeaders(0);
      }).rejects.toThrowError();
    });
    it('throws an error when a value greater than 10 is inputted', async () => {
      getTodaysScoresFunc.mockImplementation(() => 'response');
      await expect(async () => {
        await getLeaders(11);
      }).rejects.toThrowError();
    });
  });

  describe('removeFromLeaderboard', () => {
    it('returns value from removeScore', async () => {
      removeFunc.mockImplementation(() => testScoreModel);
      const removedScore = await removeScoreFromLeaderboard('test');
      expect(removeScore).toBeCalledTimes(1);
      expect(removedScore.teamName).toEqual(testScoreModel.teamName);
      expect(removedScore.teamMembers).toEqual(testScoreModel.teamMembers);
    });
  });

  describe('findScoreByID', () => {
    it('returns value from findScore', async () => {
      findFunc.mockImplementation(() => testScoreModel);
      const foundScore = await findScoreByID('test');
      expect(findScore).toBeCalledTimes(1);
      expect(foundScore.teamName).toEqual(testScoreModel.teamName);
      expect(foundScore.teamMembers).toEqual(testScoreModel.teamMembers);
    });
  });

  describe('updateScoreValue', () => {
    it('returns value from UpdateScore', async () => {
      updateFunc.mockImplementation(() => testScoreModel2);
      const prevScore = await updateScoreValue(testScoreModel);
      expect(updateScore).toBeCalledTimes(1);
      expect(prevScore.teamName).toEqual(testScoreModel2.teamName);
      expect(prevScore.teamMembers).toEqual(testScoreModel2.teamMembers);
    });
  });
});
