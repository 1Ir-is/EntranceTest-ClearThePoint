import React, { useState, useEffect } from "react";

export const Game = () => {
  const [points, setPoints] = useState(0);
  const [remainingPoint, setRemainingPoint] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(null);

  const startGame = () => {
    if (points > 0) {
      const pointArray = Array.from(
        { length: points },
        (_, index) => index + 1
      );
      setRemainingPoint(pointArray);
      setIsPlaying(true);
      setTimer(setInterval(() => setTime((prevTime) => prevTime + 0.01), 10));
    }
  };

  const restartGame = () => {
    setIsPlaying(false);
    setRemainingPoint([]);
    setPoints(0);
    setTime(0);
    if (timer) {
      clearInterval(timer);
    }
  };

  const clearPoint = (point) => {
    setRemainingPoint(remainingPoint.filter((p) => p !== point));
    if (remainingPoint.length === 1) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.01);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div>
      <h1>Let's Play</h1>

      <div>
        <label htmlFor="points">Points: </label>
        <input type="number" className="border p-1" />
      </div>

      <div className="mb-4">
        <label htmlFor="time">Time: </label>
        <span>0.00</span>
      </div>

      <button>{isPlaying ? "Restart" : "Start"}</button>
    </div>
  );
};
