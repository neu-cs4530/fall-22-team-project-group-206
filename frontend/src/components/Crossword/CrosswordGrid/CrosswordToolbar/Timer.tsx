import React, { useState } from 'react';

const INTERVAL = 1000;
const HOUR_UNIT = 24;
const MINUTE_UNIT = 60;
const SECOND_UNIT = 60;
export default function Timer({
  startTime,
  isPaused,
}: {
  startTime: number;
  isPaused: boolean;
}): JSX.Element {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);

  const getTime = () => {
    const time = Date.now() - startTime;

    setHours(
      Math.floor(
        (time % (INTERVAL * MINUTE_UNIT * SECOND_UNIT * HOUR_UNIT)) /
          (INTERVAL * MINUTE_UNIT * SECOND_UNIT),
      ),
    );
    setMinutes(
      Math.floor((time % (INTERVAL * MINUTE_UNIT * SECOND_UNIT)) / (INTERVAL * MINUTE_UNIT)),
    );
    setSecond(Math.floor((time % (INTERVAL * SECOND_UNIT)) / INTERVAL));
  };

  setInterval(() => getTime(), INTERVAL);

  return <div>{!isPaused ? hours + ':' + minutes + ':' + second : `0:0:0`}</div>;
}
