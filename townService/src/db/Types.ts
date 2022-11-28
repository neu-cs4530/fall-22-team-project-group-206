import { ScoreModel } from '../types/CoveyTownSocket';

/**
 * The api response for CRUD operations conducted on scores within the database.
 */
export interface ScoreModifyResponse {
  status: number;
  data: {
    score?: ScoreModel;
    errorType?: string;
    errorMessage?: string;
  };
}

/**
 * The api response for finding multiple scores within the database (ex. the whole leaderboard).
 */
export interface ScoreFindResponse {
  status: number;
  data: {
    scores?: ScoreModel[];
    errorType?: string;
    errorMessage?: string;
  };
}

/**
 * The api response for seeing if a teamName is currently in use
 */
export interface TeamNameInUseResponse {
  status: number;
  data: {
    inUse?: boolean;
    errorType?: string;
    errorMessage?: string;
  };
}
