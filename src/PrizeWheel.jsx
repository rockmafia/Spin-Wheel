import React, { useState, useEffect, useRef } from 'react';
import Button from './components/ui/Button';
import {Card, CardHeader, CardContent } from './components/ui/card';

const PrizeWheel = () => {
  const [prizes, setPrizes] = useState([
    { name: 'บัตร Starbucks', count: 25, color: '#006241' },
    { name: 'Gift Voucher Central 500 บาท', count: 3, color: '#e11837' },
    { name: 'Gift Voucher 1000 บาท', count: 2, color: '#ffc72c' },
    { name: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#808080' },
  ]);
  const [spins, setSpins] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastPrizeTime, setLastPrizeTime] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const wheelRef = useRef(null);

  const totalPrizes = prizes.slice(0, 3).reduce((sum, prize) => sum + prize.count, 0);
  const totalTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

  useEffect(() => {
    let timer;
    if (startTime && !isGameOver) {
      timer = setInterval(() => {
        const now = Date.now();
        setElapsedTime(now - startTime);
        if (now - startTime >= totalTime) {
          setIsGameOver(true);
          clearInterval(timer);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, isGameOver]);

  const spin = () => {
    if (isGameOver || isSpinning) return;

    setIsSpinning(true);
    if (!startTime) {
      setStartTime(Date.now());
    }

    setSpins(spins + 1);

    const remainingTime = Math.max(0, totalTime - elapsedTime);
    const remainingPrizes = prizes.slice(0, 3).reduce((sum, prize) => sum + prize.count, 0);
    
    // Calculate probability of winning a prize
    const timeSinceLastPrize = elapsedTime - lastPrizeTime;
    const averageTimeBetweenPrizes = totalTime / totalPrizes;
    let prizeProb = Math.min(1, timeSinceLastPrize / averageTimeBetweenPrizes);

    // Adjust probability based on remaining prizes and time
    prizeProb *= remainingPrizes / (totalPrizes * (remainingTime / totalTime));

    let selectedPrize;
    if (Math.random() < prizeProb && spins > 50) {
      const availablePrizes = prizes.filter(prize => prize.count > 0 && prize.name !== 'เสียใจด้วยคุณไม่ได้รับรางวัล');
      if (availablePrizes.length > 0) {
        selectedPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
        setLastPrizeTime(elapsedTime);
      }
    }

    if (!selectedPrize) {
      selectedPrize = prizes[prizes.length - 1]; // เสียใจด้วยคุณไม่ได้รับรางวัล
    }

    const prizeIndex = prizes.findIndex(p => p.name === selectedPrize.name);
    const newRotation = wheelRotation + 360 * 5 + (360 / prizes.length) * (prizes.length - prizeIndex);
    setWheelRotation(newRotation);
    
    wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheelRef.current.style.transform = `rotate(${newRotation}deg)`;

    setTimeout(() => {
      setIsSpinning(false);
      setPrizes(prizes.map(prize =>
        prize.name === selectedPrize.name && prize.count !== Infinity
          ? { ...prize, count: prize.count - 1 }
          : prize
      ));
      setResult(`คุณได้รับ ${selectedPrize.name}!`);

      if (remainingPrizes === 1 || elapsedTime >= totalTime) {
        setIsGameOver(true);
      }
    }, 5000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center text-2xl font-bold">วงล้อสุ่มรางวัล</CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative w-64 h-64 mx-auto">
            <div 
              ref={wheelRef}
              className="w-full h-full rounded-full absolute"
              style={{
                background: `conic-gradient(${prizes.map((prize, index) => 
                  `${prize.color} 0deg ${360 / prizes.length * (index + 1)}deg`
                ).join(', ')})`,
                transition: 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                transform: `rotate(${wheelRotation}deg)`,
              }}
            ></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-yellow-400 clip-path-triangle"></div>
          </div>
          <div className='text-black'>เวลาที่เหลือ: {Math.max(0, Math.floor((totalTime - elapsedTime) / 1000))} วินาที</div>
          <div className='text-black'>จำนวนการหมุน: {spins}</div>
          <div className='text-black'>
            รางวัลที่เหลือ:
            <ul>
              {prizes.slice(0, 3).map((prize, index) => (
                <li key={index}>{prize.name}: {prize.count}</li>
              ))}
            </ul>
          </div>
          <div className="text-center font-bold">{result}</div>
          <Button 
            onClick={spin} 
            disabled={isGameOver || isSpinning}
            className="w-full"
          >
            {isGameOver ? 'เกมจบแล้ว' : isSpinning ? 'กำลังหมุน...' : 'หมุน!'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrizeWheel;