import express from 'express';
import crosswordPuzzle from '../town/CrosswordPuzzleService';

const router = express.Router();

router.get('/getDaily', crosswordPuzzle.getCrosswordPuzzle);

export default router;
