// src/components/Game.js
import React, { useState, useEffect } from "react";

const Game = () => {
  const [points, setPoints] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextToClear, setNextToClear] = useState(1); // Track the next point to clear
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [allCleared, setAllCleared] = useState(false); // Track if all points are cleared

  useEffect(() => {
    let interval;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100); // Update the timer every 100ms
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  // Check if all points are cleared
  useEffect(() => {
    if (remainingPoints.length === 0 && isPlaying && !gameOver) {
      setIsPlaying(false); // Stop the game
      setAllCleared(true); // Mark as all cleared
    }
  }, [remainingPoints, isPlaying, gameOver]);

  // Function to generate random positions within the container
  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * 85); // Percentage for left position
    const y = Math.floor(Math.random() * 85); // Percentage for top position
    return { top: `${y}%`, left: `${x}%` };
  };

  const startGame = () => {
    if (points > 0) {
      // Generate points with random positions
      const pointArray = Array.from({ length: points }, (_, i) => ({
        id: i + 1,
        position: getRandomPosition(),
      }));
      setRemainingPoints(pointArray);
      setIsPlaying(true);
      setNextToClear(1); // Start with the first point
      setGameOver(false); // Reset game over status
      setAllCleared(false); // Reset all cleared status
      setTime(0); // Reset time
    }
  };

  const restartGame = () => {
    setIsPlaying(false);
    setRemainingPoints([]);
    setPoints(0);
    setTime(0);
    setGameOver(false); // Reset game over status
    setAllCleared(false); // Reset all cleared status
  };

  const clearPoint = (id) => {
    if (id === nextToClear) {
      // Correct point clicked
      setRemainingPoints(remainingPoints.filter((point) => point.id !== id));
      setNextToClear(nextToClear + 1); // Move to the next point
    } else {
      // Wrong point clicked, end the game
      setGameOver(true);
      setIsPlaying(false);
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

      <div className="relative w-96 h-96 border bg-white">
        {gameOver ? (
          <span className="text-lg font-bold text-red-500">Game Over!</span>
        ) : allCleared ? (
          <span className="text-lg font-bold text-green-500">All Cleared!</span>
        ) : remainingPoints.length > 0 ? (
          remainingPoints.map((point) => (
            <div
              key={point.id}
              style={{
                position: "absolute",
                top: point.position.top,
                left: point.position.left,
              }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 cursor-pointer"
              onClick={() => clearPoint(point.id)}
            >
              {point.id}
            </div>
          ))
        ) : isPlaying ? (
          <span className="text-lg font-bold">Loading points...</span>
        ) : null}
      </div>
    </div>
  );
};

export default Game;
