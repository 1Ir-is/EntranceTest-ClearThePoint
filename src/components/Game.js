import React, { useState, useEffect } from "react";
import { Input, Button, Modal } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const Game = () => {
  const [points, setPoints] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // Track the next point to clear
  const [nextToClear, setNextToClear] = useState(1);
  // Track if the game is over
  const [gameOver, setGameOver] = useState(false);
  // Track if all points are cleared
  const [allCleared, setAllCleared] = useState(false);
  // Track if points were not entered
  const [noPointsEntered, setNoPointsEntered] = useState(false);

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
      // Stop the game
      setIsPlaying(false);
      // Mark as all cleared
      setAllCleared(true);
    }
  }, [remainingPoints, isPlaying, gameOver]);

  // Function to generate random positions within the container
  const getRandomPosition = () => {
    // Percentage for left position
    const x = Math.floor(Math.random() * 85);
    // Percentage for top position
    const y = Math.floor(Math.random() * 85);
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
      // Start with the first point
      setNextToClear(1);
      // Reset game over status
      setGameOver(false);
      // Reset all cleared status
      setAllCleared(false);
      // Reset time
      setTime(0);
    } else {
      // Show the modal if no points entered
      setNoPointsEntered(true);
    }
  };

  const restartGame = () => {
    setIsPlaying(false);
    setRemainingPoints([]);
    setPoints(0);
    setTime(0);
    // Reset game over status
    setGameOver(false);
    // Reset all cleared status
    setAllCleared(false);
  };

  const clearPoint = (id) => {
    if (id === nextToClear) {
      // Correct point clicked
      setRemainingPoints(remainingPoints.filter((point) => point.id !== id));
      // Move to the next point
      setNextToClear(nextToClear + 1);
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
        <Input
          type="number"
          className="border p-1"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          disabled={isPlaying}
          style={{ width: 100 }}
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Time:</label>
        <span>{time.toFixed(1)}s</span>
      </div>
      <Button
        type="primary"
        className="mb-4"
        onClick={isPlaying ? restartGame : startGame}
      >
        {isPlaying ? "Restart" : "Play"}
      </Button>

      <div className="relative w-96 h-96 border bg-white">
        {remainingPoints.length > 0 ? (
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

      {/* Modal for Game Over */}
      <Modal
        title={
          <>
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: 8 }}
            />
            Game Over
          </>
        }
        visible={gameOver}
        onOk={restartGame}
        onCancel={() => setGameOver(false)}
      >
        <p>Oops! You clicked the wrong point. Game Over!</p>
      </Modal>

      {/* Modal for All Cleared */}
      <Modal
        title={
          <>
            <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
            All Cleared
          </>
        }
        visible={allCleared}
        onOk={restartGame}
        onCancel={() => setAllCleared(false)}
      >
        <p>Congratulations! You've cleared all points.</p>
      </Modal>

      {/* Modal for No Points Entered */}
      <Modal
        title={
          <>
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: 8 }}
            />
            Points Required
          </>
        }
        visible={noPointsEntered}
        onOk={() => setNoPointsEntered(false)}
        onCancel={() => setNoPointsEntered(false)}
      >
        <p>Please enter a valid number of points before starting the game.</p>
      </Modal>
    </div>
  );
};

export default Game;
