import  { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
const Confetti = ({ active }) => {
  if (!active) return null;

  return (
    <div className="confetti-container">
      {[...Array(50)].map((_, i) => (
        <div 
          key={i} 
          className="confetti" 
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]
          }}
        />
      ))}
    </div>
  );
};

const WheelOfFortune = () => {
  const [prizes, setPrizes] = useState([
    { name: 'บัตร Starbucks', count: 25, color: '#4361ee' },
    { name: 'Gift Voucher Central 500 บาท', count: 3, color: '#7e31c4' },
    { name: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#ea33f7' },
    { name: 'เสียใจด้วยค่ะ พบกันปีหน้านะคะ', count: Infinity, color: '#fec514' },
    { name: 'Gift Voucher 1000 บาท', count: 2, color: '#add44f' },
    { name: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#6ac91d' }
  ]);

  const [spinsLeft, setSpinsLeft] = useState(50);
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours in seconds
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalSpins, setTotalSpins] = useState(0);

  const spinSound = useRef(null);
  const [isSoundLoaded, setIsSoundLoaded] = useState(true);

  useEffect(() => {
    spinSound.current = new Audio('./spin-232536.wav');
    spinSound.current.addEventListener('canplaythrough', () => setIsSoundLoaded(true));
    spinSound.current.addEventListener('error', (e) => console.error('Error loading sound:', e));

    return () => {
      if (spinSound.current) {
        spinSound.current.removeEventListener('canplaythrough', () => setIsSoundLoaded(true));
        spinSound.current.removeEventListener('error', (e) => console.error('Error loading sound:', e));
      }
    };
  }, []);

  const playSpinSound = () => {
    if (spinSound.current && isSoundLoaded) {
      spinSound.current.currentTime = 0;
      spinSound.current.play().catch(e => console.error('Error playing sound:', e));
    } else {
      console.warn('Spin sound not loaded yet');
    }
  };

  const getRandomPrizeIndex = useCallback(() => {
    const remainingPrizes = prizes.filter(prize => prize.count > 0 && prize.count !== Infinity);
    const totalRemainingCount = remainingPrizes.reduce((sum, prize) => sum + prize.count, 0);
    const remainingSpins = 50 - totalSpins;

    if (remainingSpins <= totalRemainingCount) {
      // Increase chances of winning as we approach the end
      const winningPrize = remainingPrizes[Math.floor(Math.random() * remainingPrizes.length)];
      return prizes.findIndex(prize => prize.name === winningPrize.name);
    }

    let randomNum = Math.random();
    for (let i = 0; i < prizes.length; i++) {
      if (prizes[i].count > 0) {
        if (prizes[i].count === Infinity) {
          randomNum -= 0.1; // 10% chance for non-prize slots
        } else {
          randomNum -= prizes[i].count / 50; // Distribute remaining probability among prize slots
        }
        if (randomNum <= 0) {
          return i;
        }
      }
    }
    return prizes.findIndex(prize => prize.count === Infinity); // Default to a non-prize slot
  }, [prizes, totalSpins]);

  const updatePrizeCounts = useCallback((index) => {
    setPrizes(prevPrizes => {
      const newPrizes = [...prevPrizes];
      if (newPrizes[index].count !== Infinity && newPrizes[index].count > 0) {
        newPrizes[index] = { ...newPrizes[index], count: newPrizes[index].count - 1 };
      }
      return newPrizes;
    });
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setSpinsLeft(prevSpins => prevSpins - 1);
    setTotalSpins(prevTotal => prevTotal + 1);

    playSpinSound();

    const prizeIndex = getRandomPrizeIndex();
    const spinDegrees = 360 * 5 + (360 / prizes.length) * (prizes.length - prizeIndex);
    const newRotation = wheelRotation + spinDegrees;

    setTargetRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(prizes[prizeIndex]);
      setShowResultPopup(true);
      updatePrizeCounts(prizeIndex);
      if (prizes[prizeIndex].count !== Infinity) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      if (spinSound.current) {
        spinSound.current.pause();
        spinSound.current.currentTime = 0;
      }
    }, 5000);
  }, [isSpinning, spinsLeft, getRandomPrizeIndex, prizes, wheelRotation, updatePrizeCounts, totalSpins]);

  useEffect(() => {
    if (isSpinning) {
      const animationInterval = setInterval(() => {
        setWheelRotation(prevRotation => {
          if (prevRotation < targetRotation) {
            return prevRotation + 10;
          } else {
            clearInterval(animationInterval);
            return targetRotation;
          }
        });
      }, 16);
      return () => clearInterval(animationInterval);
    }
  }, [isSpinning, targetRotation]);

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

  useEffect(() => {
    const allPrizesGone = prizes.every(prize => prize.count === 0 || prize.count === Infinity);
    if ((allPrizesGone && totalSpins >= 50) || timeLeft === 0 || spinsLeft === 0) {
      // End the game
      setSpinsLeft(0);
    }
  }, [prizes, totalSpins, timeLeft, spinsLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const WheelSVG = () => (
    <svg width="350" height="350" viewBox="0 0 500 500">
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
      <circle cx="250" cy="250" r="240" fill="none" stroke="white" strokeWidth="20" filter="url(#shadow)" />
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
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${midAngle} ${textX} ${textY})`}
              >
                {prize.name.length > 15 ? prize.name.slice(0, 15) + '...' : prize.name}
              </text>
            </g>
          );
        })}
      </g>
      <circle cx="250" cy="250" r="15" fill="white" stroke="#333" strokeWidth="2" />
      <Star x="30" y="30" size={40} fill="#FFD700" stroke="#FFD700" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 overflow-hidden relative">
      <style jsx>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0;
          animation: fall 3s linear infinite;
        }
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      <Confetti active={showConfetti} />
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
              bg-white text-blue-500 font-bold text-xl
              transition-all duration-300 ease-in-out
              ${isSpinning || spinsLeft === 0 ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-105 active:scale-95'}
            `}
            style={{
              boxShadow: `
                0 6px 8px rgba(0, 0, 0, 0.15),
                0 3px 3px rgba(0, 0, 0, 0.1),
                inset 0 -3px 3px rgba(0, 0, 0, 0.1),
                inset 0 3px 3px rgba(255, 255, 255, 0.5)
              `
            }}
            onClick={spin}
            disabled={isSpinning || spinsLeft === 0}
          >
            <Play className="w-16 h-16 fill-current" />
          </button>
        </div>
        <div className="mt-8 text-white text-xl">
          <p>เวลาที่เหลือ: {formatTime(timeLeft)}</p>
          <p>จำนวนครั้งที่หมุนได้: {spinsLeft}</p>
          <p>จำนวนการหมุนทั้งหมด: {totalSpins}</p>
        </div>
        <Card className="mt-4 w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold">จำนวนรางวัลที่เหลือ</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {prizes.map((prize, index) => (
                prize.count !== Infinity && (
                  <div key={index} className="flex items-center space-x-2">
                    <span>{prize.name}:</span>
                    <span className="font-bold">{prize.count}</span>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {spinResult && (
        <Dialog open={showResultPopup} onOpenChange={() => setShowResultPopup(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{spinResult.count === Infinity ? 'เสียใจด้วย' : 'ยินดีด้วย!'}</DialogTitle>
            </DialogHeader>
            <p>{spinResult.name}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WheelOfFortune;