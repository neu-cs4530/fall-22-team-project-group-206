import React, { useState } from 'react';

const INTERVAL = 1000;
const HH_INDEX = 11;
const SS_INDEX = 19;
export default function Timer({
  startTime,
  isPaused,
}: {
  startTime: number;
  isPaused: boolean;
}): JSX.Element {
  const [elapsedTimeMilliSecs, setElapsedTimeMilliSecs] = useState<number>(0);
  const getTime = () => {
    const milliSecsElapsed = Date.now() - startTime;

    setElapsedTimeMilliSecs(milliSecsElapsed);
  };

  const getTimeInHHMMSS = () => {
    return new Date(elapsedTimeMilliSecs).toISOString().slice(HH_INDEX, SS_INDEX);
  };
  setInterval(() => getTime(), INTERVAL);
  return <div>{!isPaused ? getTimeInHHMMSS() : '00:00:00'}</div>;
}
