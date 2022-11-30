import React, { useEffect, useState } from 'react';
import CrosswordPuzzleAreaController from '../../../../../../../classes/CrosswordPuzzleAreaController';
import { getTimeInHHMMSS } from '../../../CrosswordUtils';

const INTERVAL = 1000;
/*
React component to represent a timer for CrosswordToolbar.
*/
export default function Timer({
  controller,
}: {
  controller: CrosswordPuzzleAreaController;
}): JSX.Element {
  const [elapsedTimeMilliSecs, setElapsedTimeMilliSecs] = useState<number>(0);
  const [isGameOver, setGameOver] = useState<boolean>(controller.isGameOver);
  console.log(isGameOver);
  useEffect(() => {
    const getTime = () => {
      const milliSecsElapsed =
        Date.now() - (controller.startTime ? controller.startTime : Date.now());

      setElapsedTimeMilliSecs(milliSecsElapsed);
    };

    const timer = setInterval(() => getTime(), INTERVAL);
    if (isGameOver) {
      clearInterval(timer);
    }

    controller.addListener('gameOverChange', setGameOver);

    return () => {
      clearInterval(timer);
      controller.removeListener('gameOverChange', setGameOver);
    };
  }, [elapsedTimeMilliSecs, isGameOver, controller]);

  return <div>{getTimeInHHMMSS(elapsedTimeMilliSecs)}</div>;
}
