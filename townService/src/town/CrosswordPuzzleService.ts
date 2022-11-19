import Express from 'express';

const getScoreBoard = async (_req: Express.Request, res: Express.Response) =>
  res.status(200).json({
    teamName: 'string',
    date: 'string',
    score: 1,
    users: ['string', 'string'],
    usedHint: false,
    completed: false,
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

export default { getScoreBoard, updateScoreBoard };
