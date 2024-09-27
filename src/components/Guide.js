import React from "react";
import { Button } from "antd";

const Guide = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        How to Play
      </h1>
      <p className="text-base sm:text-lg mb-4 text-center">
        Welcome to the game! Here's how you can play:
      </p>
      <ul className="text-base sm:text-lg mb-4 list-disc list-inside">
        <li>Enter the number of points you'd like to generate.</li>
        <li>Click on the points in numerical order, starting from 1.</li>
        <li>Don't click the wrong point, or the game will be over!</li>
        <li>Clear all points as fast as you can to win the game.</li>
        <li>Good luck!</li>
      </ul>
      <Button
        type="primary"
        onClick={onStartGame}
        className="w-full sm:w-auto"
        size="large"
      >
        Start Game
      </Button>
    </div>
  );
};

export default Guide;
