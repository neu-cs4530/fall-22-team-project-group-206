import { ScoreModel } from '../types/CoveyTownSocket';

export interface ScoreModifyResponse {
  status: number;
  data: {
    score?: ScoreModel;
    error?: Error;
  };
}

export interface ScoreFindResponse {
  status: number;
  data: {
    scores?: ScoreModel[];
    error?: Error;
  };
}
