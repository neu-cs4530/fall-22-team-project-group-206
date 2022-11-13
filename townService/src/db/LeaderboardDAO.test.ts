import { mock, mockClear } from 'jest-mock-extended';
import { ScoreModel } from "../types/CoveyTownSocket";
import score from './ScoreModel';

import {
  getLeaders,
  insertScore,
  removeScoreFromLeaderboard,
  updateScoreValue
} from './LeaderboardService';
import { removeScore, addScore, findScore, updateScore } from "./LeaderboardDAO";


describe('ScoreService', () => {

  describe('mock', () => {

    const testScore: ScoreModel = {
      teamName: 'name',
      score: 45, 
      teamMembers: ['jaime', 'frank'],
      usedHint: false,
      completed: true
  }
    beforeEach(() => {
      jest.mock("./LeaderboardDAO", () => ({
        example: jest.fn(() => testScore),}));
     
    });
    it('db mock', async () => {
      const mockExpected = "mock value";
        let result = await insertScore(testScore)
        expect(result).toEqual(testScore);
    });
  });



  })