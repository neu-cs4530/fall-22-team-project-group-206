import express from 'express';
import crosswordPuzzle from '../town/CrosswordPuzzleService';

const router = express.Router();

router.get('/getDaily', crosswordPuzzle.getCrosswordPuzzle);

router.get('/getScoreBoard', crosswordPuzzle.getScoreBoard);

export default router;
