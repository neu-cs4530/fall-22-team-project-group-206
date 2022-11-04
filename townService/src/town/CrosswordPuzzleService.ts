import Express from 'express';

const CROSSWORDPUZZLE_EXTERNAL_LINK =
  'https://api.foracross.com/api/puzzle_list?page=0&pageSize=1&filter%5BnameOrTitleFilter%5D=Will%20Shortz&filter%5BsizeFilter%5D%5BMini%5D=false&filter%5BsizeFilter%5D%5BStandard%5D=true';

/**
 * Get the daily crossword puzzle from external API and sent response according to the response from external API
 * @returns a response that includes the a crossword puzzle
 */
// public getCrosswordPuzzle(): object => {
//   // get the crossword puzzle
//   try {
//     const result: AxiosResponse = await axios.get(CROSSWORDPUZZLE_EXTERNAL_LINK);
//     const puzzle = result.data.puzzles[0];
//     return puzzle.conetent;
//   } catch (err) {
//     throw new Error('Error when fetching the puzzle');
//   }
// };

const getScoreBoard = async (_req: Express.Request, res: Express.Response) =>
  res.status(200).json({
    teamName: 'string',
    date: 'string',
    score: 1,
    users: ['string', 'string'],
    usedHint: false,
    completePercentage: 1,
  });

const updateScoreBoard = async (_req: Express.Request, res: Express.Response) => {
  // const scoreContent = req.body;
  try {
    // TODO
    return res.status(200);
  } catch (err) {
    // TODO
  }
  return res.status(404);
};

export default { CROSSWORDPUZZLE_EXTERNAL_LINK, getScoreBoard, updateScoreBoard };
