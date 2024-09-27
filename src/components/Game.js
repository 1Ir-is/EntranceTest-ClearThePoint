import React, { useState, useEffect } from "react";
import { Input, Button, Modal } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Guide from "./Guide";

const Game = () => {
  const [points, setPoints] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextToClear, setNextToClear] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [allCleared, setAllCleared] = useState(false);
  const [noPointsEntered, setNoPointsEntered] = useState(false);
  const [pointsExceedLimit, setPointsExceedLimit] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    let interval;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  // Check if all points are cleared
  useEffect(() => {
    if (remainingPoints.length === 0 && isPlaying && !gameOver) {
      setIsPlaying(false);
      setAllCleared(true);
    }
  }, [remainingPoints, isPlaying, gameOver]);

  // Function to calculate the distance between two points
  const calculateDistance = (point1, point2) => {
    const xDiff = point1.x - point2.x;
    const yDiff = point1.y - point2.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  };

  // Function to generate random positions within the container with spacing logic
  const getRandomPosition = (existingPoints) => {
    let newPosition;
    let tooClose = true;

    const isTooClose = (point) =>
      calculateDistance(newPosition, point.position) < 10;

    while (tooClose) {
      const x = Math.floor(Math.random() * 85);
      const y = Math.floor(Math.random() * 85);
      newPosition = { x, y, top: `${y}%`, left: `${x}%` };

      tooClose = existingPoints.some(isTooClose);
    }

    return newPosition;
  };

  const startGame = () => {
    if (points > 0) {
      const pointArray = [];
      for (let i = 0; i < points; i++) {
        const newPoint = {
          id: i + 1,
          position: getRandomPosition(pointArray),
        };
        pointArray.push(newPoint);
      }
      setRemainingPoints(pointArray);
      setIsPlaying(true);
      setNextToClear(1);
      setGameOver(false);
      setAllCleared(false);
      setTime(0);
    } else {
      setNoPointsEntered(true);
    }
  };

  const restartGame = () => {
    setIsPlaying(false);
    setRemainingPoints([]);
    setPoints(0);
    setTime(0);
    setGameOver(false);
    setAllCleared(false);
  };

  const clearPoint = (id) => {
    if (id === nextToClear) {
      setRemainingPoints(remainingPoints.filter((point) => point.id !== id));
      setNextToClear(nextToClear + 1);
    } else {
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    if (value > 50) {
      setPointsExceedLimit(true);
      setPoints(50);
    } else if (value >= 0) {
      setPoints(value);
    }
  };

  return showGuide ? (
    <Guide onStartGame={() => setShowGuide(false)} />
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">LET'S PLAY</h1>
      <div className="mb-4">
        <label className="mr-2">Points:</label>
        <Input
          type="number"
          className="border p-1"
          value={points}
          onChange={handleInputChange}
          disabled={isPlaying}
          style={{ width: 100 }}
          min={0}
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Time:</label>
        <span>{time.toFixed(1)}s</span>
      </div>
      <Button
        type="primary"
        className="mb-4 text-lg px-6 py-3"
        onClick={isPlaying ? restartGame : startGame}
        size="large"
      >
        {isPlaying ? "Restart" : "Play"}
      </Button>

      <div className="relative w-full max-w-[600px] h-[60vw] max-h-[600px] border bg-white">
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

      {/* Modal for Exceeding Point Limit */}
      <Modal
        title={
          <>
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: 8 }}
            />
            Exceeds Point Limit
          </>
        }
        visible={pointsExceedLimit}
        onOk={() => setPointsExceedLimit(false)}
        onCancel={() => setPointsExceedLimit(false)}
      >
        <p>
          The number of points cannot exceed 50. Please enter a number less than
          or equal to 50.
        </p>
      </Modal>
    </div>
  );
};

export default Game;
