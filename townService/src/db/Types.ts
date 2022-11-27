import { ScoreModel } from '../types/CoveyTownSocket';

/**
 * The api response for CRUD operations conducted on scores within the database.
 */
export interface ScoreModifyResponse {
  status: number;
  data: {
    score?: ScoreModel;
    error?: Error;
  };
}

/**
 * The api response for finding multiple scores within the database (ex. the whole leaderboard).
 */
export interface ScoreFindResponse {
  status: number;
  data: {
    scores?: ScoreModel[];
    error?: Error;
  };
}
