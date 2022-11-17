import { addScore, removeScore, findScore, updateScore, getScores } from './LeaderboardDAO';
import score from './ScoreModel';
import { IScore } from './IScore';
import {
  getLeaders,
  insertScore,
  removeScoreFromLeaderboard,
  updateScoreValue,
  findScoreByID,
} from './LeaderboardService';
import { ScoreModel } from '../types/CoveyTownSocket';
import { AddressConfigurationResource } from 'twilio/lib/rest/conversations/v1/addressConfiguration';

jest.mock('./LeaderboardDAO', () => {
  const original = jest.requireActual('./LeaderboardDAO');
  return {
    __esModule: true,
    ...original,
    addScore: jest.fn(),
    removeScore: jest.fn(),
    findScore: jest.fn(),
    updateScore: jest.fn(),
    getScores: jest.fn(),
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
  teamName: 'best',
  score: 10,
  teamMembers: ['player1', 'player2'],
  usedHint: false,
};

const testLeaderboard: ScoreModel[] = [testScoreModel, testScoreModel2, testScoreModelBest];

const testScore: IScore = new score(testScoreModel);
const addFunc: any = addScore as jest.Mock;
const getScoresFunc: any = getScores as jest.Mock;
const removeFunc: any = removeScore as jest.Mock;
const findFunc: any = findScore as jest.Mock;
const updateFunc: any = updateScore as jest.Mock;

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
    it('throws an error when addScore is undefined', async () => {
      addFunc.mockImplementation(() => undefined);
      await expect(async () => {
        await insertScore(testScoreModel);
      }).rejects.toThrowError();
    });
  });

  describe('getLeaders', () => {
    it('calls getScores and sorts list', async () => {
      getScoresFunc.mockImplementation(() => testLeaderboard);
      const leaderboard = await getLeaders(3);
      expect(getScores).toBeCalledTimes(1);
      expect(leaderboard.length).toEqual(3);
      expect(leaderboard[0].teamName).toEqual(testScoreModelBest.teamName);
      expect(leaderboard[1].teamName).toEqual(testScoreModel.teamName);
      expect(leaderboard[2].teamName).toEqual(testScoreModel2.teamName);
    });

    it('throws an error when getScores returns undefined', async () => {
      getScoresFunc.mockImplementation(() => undefined);
      await expect(async () => {
        await getLeaders(5);
      }).rejects.toThrowError();
    });
    it('throws an error when getScores returns null', async () => {
      getScoresFunc.mockImplementation(() => null);
      await expect(async () => {
        await getLeaders(5);
      }).rejects.toThrowError();
    });

    it('calls getScores and only returns the alloted number', async () => {
      getScoresFunc.mockImplementation(() => testLeaderboard);
      const leaderboard = await getLeaders(1);
      expect(getScores).toBeCalledTimes(1);
      expect(leaderboard.length).toEqual(1);
      expect(leaderboard[0].teamName).toEqual(testScoreModelBest.teamName);
    });
    it('calls getScores and returns all available if there are not enough scores', async () => {
      getScoresFunc.mockImplementation(() => testLeaderboard);
      const leaderboard = await getLeaders(10);
      expect(getScores).toBeCalledTimes(1);
      expect(leaderboard.length).toEqual(3);
      expect(leaderboard[0].teamName).toEqual(testScoreModelBest.teamName);
      expect(leaderboard[1].teamName).toEqual(testScoreModel.teamName);
      expect(leaderboard[2].teamName).toEqual(testScoreModel2.teamName);
    });

    it('throws an error when a value less than 1 is inputed', async () => {
      getScoresFunc.mockImplementation(() => 'response');
      await expect(async () => {
        await getLeaders(0);
      }).rejects.toThrowError();
    });
    it('throws an error when a value greater than 10 is inputed', async () => {
      getScoresFunc.mockImplementation(() => 'response');
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
    it('throws an error when removeScore returns undefined', async () => {
      removeFunc.mockImplementation(() => undefined);
      await expect(async () => {
        await removeScoreFromLeaderboard('test');
      }).rejects.toThrowError();
    });
    it('throws an error when removeScore returns null', async () => {
      removeFunc.mockImplementation(() => null);
      await expect(async () => {
        await removeScoreFromLeaderboard('test');
      }).rejects.toThrowError();
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
    it('throws an error when removeScore returns undefined', async () => {
      findFunc.mockImplementation(() => undefined);
      await expect(async () => {
        await findScoreByID('test');
      }).rejects.toThrowError();
    });
    it('throws an error when removeScore returns null', async () => {
      findFunc.mockImplementation(() => null);
      await expect(async () => {
        await findScoreByID('test');
      }).rejects.toThrowError();
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
    it('throws an error when updateScore returns undefined', async () => {
      updateFunc.mockImplementation(() => undefined);
      await expect(async () => {
        await updateScoreValue(testScoreModel2);
      }).rejects.toThrowError();
    });
    it('throws an error when updateScore returns null', async () => {
      updateFunc.mockImplementation(() => null);
      await expect(async () => {
        await updateScoreValue(testScoreModel2);
      }).rejects.toThrowError();
    });
  });
});
