import React, { useState, useEffect } from 'react';

/**
 * Detail for scores
 */
export default function Timer(): JSX.Element {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [sec, setSec] = useState<number>(0);

  const getTime = () => {
    //   setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    //   setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    //   setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSec(sec + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  });
  return <div>{sec}</div>;
}
