import React, { useState, useEffect } from 'react';

const INTERVAL = 1000;
export default function Timer(props: { startTime: number; isPaused: boolean }): JSX.Element {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const time = Date.now() - props.startTime;

  const getTime = () => {
    if (!props.isPaused) {
      setHours(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
      setSecond(Math.floor((time % (1000 * 60)) / 1000));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), INTERVAL);

    return () => clearInterval(interval);
  });
  return <div>{hours + ':' + minutes + ':' + second}</div>;
}
