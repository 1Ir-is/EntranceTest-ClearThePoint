// src/Game.js
import React, { useState, useEffect } from "react";

const Game = () => {
  const [points, setPoints] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100); // Update the timer every 100ms
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const startGame = () => {
    if (points > 0) {
      const pointArray = Array.from({ length: points }, (_, i) => i + 1);
      setRemainingPoints(pointArray);
      setIsPlaying(true);
      setTime(0); // Reset time
    }
  };

  const restartGame = () => {
    setIsPlaying(false);
    setRemainingPoints([]);
    setPoints(0);
    setTime(0);
    if (timerId) {
      clearInterval(timerId);
    }
  };

  const clearPoint = (point) => {
    setRemainingPoints(remainingPoints.filter((p) => p !== point));
    if (remainingPoints.length === 1) {
      setIsPlaying(false); // Stop the game when all points are cleared
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">LET'S PLAY</h1>
      <div className="mb-4">
        <label className="mr-2">Points:</label>
        <input
          type="number"
          className="border p-1"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          disabled={isPlaying}
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Time:</label>
        <span>{time.toFixed(1)}s</span>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={isPlaying ? restartGame : startGame}
      >
        {isPlaying ? "Restart" : "Play"}
      </button>

      <div className="relative w-96 h-96 border flex flex-wrap justify-center items-center bg-white">
        {remainingPoints.length > 0 ? (
          remainingPoints.map((point) => (
            <div
              key={point}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 m-2 cursor-pointer"
              onClick={() => clearPoint(point)}
            >
              {point}
            </div>
          ))
        ) : isPlaying ? (
          <span className="text-lg font-bold">All Cleared!</span>
        ) : null}
      </div>
    </div>
  );
};

export default Game;
