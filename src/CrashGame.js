import React, { useState, useEffect } from 'react';
import './CrashGame.css';

const predefinedOdds = [1.5, 5, 4, 2, 1.5];

const CrashGame = () => {
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [odds, setOdds] = useState(1.00);
  const [bet, setBet] = useState(0);
  const [cashOut, setCashOut] = useState(false);
  const [lineWidth, setLineWidth] = useState(0);
  const [crashIndex, setCrashIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => { 
    let interval;
    if (isGameRunning) {
      interval = setInterval(() => {
        setOdds((prevOdds) => {
          const newOdds = +parseFloat(prevOdds + 0.01).toFixed(2);
          if (newOdds >= predefinedOdds[crashIndex]) {
            clearInterval(interval);
            setIsGameRunning(false);
            setLineWidth(0);
            setMessage(`Game crashed at ${predefinedOdds[crashIndex]}x! Starting new game in 10 seconds...`);
            setTimer(10);
            return newOdds;
          }
          return newOdds;
        });
        if (!cashOut) {
          setLineWidth((prevWidth) => prevWidth + 2);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isGameRunning, cashOut, crashIndex]);

  useEffect(() => {
    let countdown = null;
    if (timer > 0) {
      countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && !isGameRunning) {
      handleStart();
    }

    return () => clearTimeout(countdown);
  }, [timer, isGameRunning]);

  const handleStart = () => {
    setCashOut(false);
    setOdds(1.00);
    setLineWidth(0);
    setIsGameRunning(true);
    setMessage('');
    setTimer(0); // Reset timer when game starts
    setCrashIndex((prevIndex) => (prevIndex + 1) % predefinedOdds.length);
  };

  const handleCashOut = () => {
    setCashOut(true);
    setMessage(`You cashed out at ${odds}x!`);
  };

  return (
    <div className="game-container">
      <h2>Crash Betting Game</h2>
      <input
        type="number"
        placeholder="Place your bet"
        value={bet}
        onChange={(e) => setBet(e.target.value)}
        disabled={isGameRunning}
      />
      <button onClick={handleStart} disabled={isGameRunning || bet <= 0}>Start</button>
      <button onClick={handleCashOut} disabled={!isGameRunning || cashOut}>Cash Out</button>
      <div className="odds-display">Odds: {odds}x</div>
      <div className="line" style={{width: `${lineWidth}px`}}></div>
      {message && <div className="message">{message}</div>}
      {timer > 0 && <div className="timer">Next game starts in: {timer}</div>}
    </div>
  );
};

export default CrashGame;
