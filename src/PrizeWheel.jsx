import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Play } from 'lucide-react';
// import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const WheelOfFortune = () => {
  const [prizes, setPrizes] = useState([
    { name: 'Gift Voucher 1000 บาท', count: 2, color: '#FF5C5C' },
    { name: 'บัตร Starbucks', count: 10, color: '#5EE65E' },
    { name: 'บัตร Starbucks', count: 10, color: '#B0E0E6' },
    { name: 'Gift Voucher', count: 3, color: '#FFA500' },
    { name: 'เสียใจด้วยค่ะ', count: 5, color: '#8A2BE2' },
    { name: 'เสียใจด้วยค่ะ คุณไม่ได้...', count: 10, color: '#4169E1' },
    { name: 'เสียใจด้วยค่ะ มีโอกาส...', count: 10, color: '#FF69B4' },
  ]);

  const [spinsLeft, setSpinsLeft] = useState(20);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);

  const getRandomPrizeIndex = useCallback(() => {
    const totalPrizes = prizes.reduce((sum, prize) => sum + prize.count, 0);
    let random = Math.floor(Math.random() * totalPrizes);
    for (let i = 0; i < prizes.length; i++) {
      if (random < prizes[i].count) return i;
      random -= prizes[i].count;
    }
    return prizes.length - 1;
  }, [prizes]);

  const updatePrizeCounts = useCallback((chosenPrize) => {
    setPrizes(prevPrizes => 
      prevPrizes.map(prize => {
        if (prize.name === chosenPrize.name && prize.count > 0) {
          return { ...prize, count: prize.count - 1 };
        }
        return prize;
      })
    );
  }, []);

  const spin = () => {
    if (spinsLeft > 0 && timeLeft > 0 && !isSpinning) {
      setIsSpinning(true);
      const prizeIndex = getRandomPrizeIndex();
      const segmentAngle = 360 / prizes.length;
      const targetRotation = 360 * 5 + (prizes.length - 1 - prizeIndex) * segmentAngle + Math.random() * segmentAngle;
      setTargetRotation(prevRotation => prevRotation + targetRotation);

      setTimeout(() => {
        const chosenPrize = prizes[prizeIndex];
        setResult(chosenPrize.name);
        updatePrizeCounts(chosenPrize);
        setSpinsLeft(prevSpins => prevSpins - 1);
        setIsSpinning(false);
        setCurrentPrizeIndex(prizeIndex);
        setSpinResult(chosenPrize);
        setShowResultPopup(true);
      }, 5000);
    }
  };

  useEffect(() => {
    let animationFrameId;
    
    const animateRotation = () => {
      if (wheelRotation < targetRotation) {
        const newRotation = Math.min(wheelRotation + 10, targetRotation);
        setWheelRotation(newRotation);
        animationFrameId = requestAnimationFrame(animateRotation);
      }
    };

    if (isSpinning) {
      animationFrameId = requestAnimationFrame(animateRotation);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isSpinning, wheelRotation, targetRotation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const WheelSVG = () => (
    <svg width="500" height="500" viewBox="0 0 500 500">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform={`rotate(${wheelRotation} 250 250)`}>
        {prizes.map((prize, index) => {
          const angle = (index / prizes.length) * 360;
          const nextAngle = ((index + 1) / prizes.length) * 360;
          const midAngle = (angle + nextAngle) / 2;
          const x1 = 250 + 230 * Math.cos((angle * Math.PI) / 180);
          const y1 = 250 + 230 * Math.sin((angle * Math.PI) / 180);
          const x2 = 250 + 230 * Math.cos((nextAngle * Math.PI) / 180);
          const y2 = 250 + 230 * Math.sin((nextAngle * Math.PI) / 180);
          const textRadius = 140;
          const textX = 250 + textRadius * Math.cos((midAngle * Math.PI) / 180);
          const textY = 250 + textRadius * Math.sin((midAngle * Math.PI) / 180);

          return (
            <g key={index}>
              <path
                d={`M250,250 L${x1},${y1} A230,230 0 0,1 ${x2},${y2} Z`}
                fill={prize.color}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={textX}
                y={textY}
                fill="white"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${midAngle} ${textX} ${textY})`}
              >
                {prize.name.length > 10 ? prize.name.slice(0, 10) + '...' : prize.name}
              </text>
            </g>
          );
        })}
      </g>
      <circle cx="250" cy="250" r="15" fill="white" stroke="#333" strokeWidth="2" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-white opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6 text-white shadow-text">วงล้อแห่งโชค</h1>
        <div className="relative">
          <WheelSVG />
          <button
            className={`
              absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              w-24 h-24 rounded-full flex items-center justify-center
              text-white font-bold text-xl
              transition-all duration-300 ease-in-out
              ${isSpinning ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-105 active:scale-95'}
            `}
            style={{
              background: 'linear-gradient(145deg, #3498db, #2980b9)',
              boxShadow: `
                0 0 0 8px rgba(255, 255, 255, 0.8),
                0 0 0 10px rgba(59, 130, 246, 0.5),
                0 4px 6px rgba(0, 0, 0, 0.3),
                inset 0 2px 4px rgba(255, 255, 255, 0.5),
                inset 0 -2px 4px rgba(0, 0, 0, 0.2)
              `
            }}
            onClick={spin}
            disabled={isSpinning}
          >
            <Play className="w-16 h-16 drop-shadow-lg" />
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xl font-semibold text-white">เวลาที่เหลือ: {formatTime(timeLeft)}</p>
          <p className="text-lg text-white mb-4">จำนวนการหมุนที่เหลือ: {spinsLeft}</p>
          <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-lg inline-block">
            <h2 className="text-lg font-bold mb-2">ตำแหน่งปัจจุบัน</h2>
            <div className="text-sm">
              <p>รางวัล: {prizes[currentPrizeIndex].name}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {prizes.map((prize, index) => (
            <div key={index} className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
              <p className="font-semibold">{prize.name}</p>
              <p>เหลือ: {prize.count}</p>
            </div>
          ))}
        </div>
      </div>
      {spinResult && (
        <Dialog open={showResultPopup} onOpenChange={() => setShowResultPopup(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{spinResult.name.includes('เสียใจ') ? 'เสียใจด้วย' : 'ยินดีด้วย!'}</DialogTitle>
            </DialogHeader>
            <p>{spinResult.name}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WheelOfFortune;

