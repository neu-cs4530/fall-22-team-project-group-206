import Express from 'express';

const CROSSWORDPUZZLE_EXTERNAL_LINK =
  'https://api.foracross.com/api/puzzle_list?page=0&pageSize=1&filter%5BnameOrTitleFilter%5D=Will%20Shortz&filter%5BsizeFilter%5D%5BMini%5D=false&filter%5BsizeFilter%5D%5BStandard%5D=true';

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
