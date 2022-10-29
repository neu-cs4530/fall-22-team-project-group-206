import Express from 'express';
import axios, { AxiosResponse } from 'axios';
import { CrosswordPuzzleModel } from '../types/CoveyTownSocket';

const CROSSWORDPUZZLE_EXTERNAL_LINK =
  'https://api.foracross.com/api/puzzle_list?page=0&pageSize=1&filter%5BnameOrTitleFilter%5D=Will%20Shortz&filter%5BsizeFilter%5D%5BMini%5D=false&filter%5BsizeFilter%5D%5BStandard%5D=true';

/**
 * Get the daily crossword puzzle from external API and sent response according to the response from external API
 * @returns a response that includes the a crossword puzzle
 */
const getCrosswordPuzzle = async (_req: Express.Request, res: Express.Response) => {
  // get some posts
  const result: AxiosResponse = await axios.get(CROSSWORDPUZZLE_EXTERNAL_LINK);
  const posts: CrosswordPuzzleModel = result.data.puzzles[0];
  return res.status(200).json({
    puzzle: posts,
  });
};

export default { getCrosswordPuzzle };
