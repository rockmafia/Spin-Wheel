import React, { useState, useEffect, useRef } from 'react';
import { Gem } from 'lucide-react';
import Gold from "../src/assets/gold.png"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialPrizes = [
  { id: 1, label: 'ลุ้นรับทองคำ 1 บาท', count: 3, color: '#FFD700', textColor: '#000000' },
  { id: 2, label: 'ไม่ได้รับรางวัล', count: Infinity, color: '#f60101', textColor: '#f60101' },
  { id: 3, label: 'ลุ้นรับทองคำ 1 บาท', count: 2, color: '#FFD700', textColor: '#000000' },
  { id: 4, label: 'ลุ้นรับทองคำ 1 บาท', count: 2, color: '#FFD700', textColor: '#000000' },
  { id: 5, label: 'พบกันปีหน้า', count: Infinity, color: '#f60101', textColor: '#f60101' },
  { id: 6, label: 'ลุ้นรับทองคำ 1 บาท', count: 3, color: '#FFD700', textColor: '#000000' },
  { id: 7, label: 'ไม่ได้รับรางวัล', count: Infinity, color: '#f60101', textColor: '#f60101' },
];

const TOTAL_SPINS = 30;
const TOTAL_TIME = 6 * 60 * 60; // 6 hours in seconds
const TOTAL_LEDS = 35;
const BRIGHTER_LEDS = [0, 4, 9, 14, 19, 24, 29, 34]; // Index 0-based for 1, 5, 10, 15, 20, 25, 30, 35

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(100)].map((_, index) => (
        <div
          key={index}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            animation: `confetti-fall ${5 + Math.random() * 5}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
            width: '10px',
            height: '10px',
          }}
        />
      ))}
    </div>
  );
};

const LED = ({ index }) => {
  const [isOn, setIsOn] = useState(false);
  const isBrighter = BRIGHTER_LEDS.includes(index);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOn(prev => !prev);
    }, Math.random() * 1000 + 500); // Random interval between 500ms and 1500ms

    return () => clearInterval(interval);
  }, []);

  const angle = (index / TOTAL_LEDS) * 360;
  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isBrighter ? 'w-4 h-4' : 'w-2 h-2'}`}
      style={{
        top: `${50 + 48 * Math.sin((angle * Math.PI) / 180)}%`,
        left: `${50 + 48 * Math.cos((angle * Math.PI) / 180)}%`,
      }}
    >
      <div className={`w-full h-full rounded-full ${isBrighter ? 'bg-yellow-200' : 'bg-yellow-300'}`}></div>
      <div 
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${isOn ? 'opacity-90' : 'opacity-0'}`}
        style={{
          backgroundColor: isBrighter ? '#fde68a' : '#fcd34d',
          boxShadow: isBrighter
            ? `0 0 10px #fde68a, 0 0 20px #fde68a, 0 0 30px #fde68a, 0 0 40px #fde68a, 0 0 70px #fde68a`
            : `0 0 5px #fcd34d`,
          filter: isBrighter ? 'brightness(1.5)' : 'none',
        }}
      ></div>
    </div>
  );
};

const LEDRing = () => {
  return (
    <div className="absolute w-full h-full">
      {[...Array(TOTAL_LEDS)].map((_, index) => (
        <LED key={index} index={index} />
      ))}
    </div>
  );
};

const LuckyWheel = () => {
  const [prizes, setPrizes] = useState(initialPrizes);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [remainingSpins, setRemainingSpins] = useState(TOTAL_SPINS);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', description: '' });
  const wheelRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) return 0;
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const adjustProbabilities = () => {
    const timePercentage = timeLeft / TOTAL_TIME;
    const spinsPercentage = remainingSpins / TOTAL_SPINS;

    if (timePercentage < spinsPercentage) {
      return prizes.map(prize => 
        (prize.id === 1 || prize.id === 3 || prize.id === 4 || prize.id === 6) && prize.count > 0
          ? { ...prize, weight: 2 }
          : { ...prize, weight: 1 }
      );
    }
    return prizes.map(prize => ({ ...prize, weight: 1 }));
  };

  const spin = () => {
    if (spinning || remainingSpins <= 0 || timeLeft <= 0) return;

    setSpinning(true);
    setRemainingSpins(prevSpins => prevSpins - 1);

    const weightedPrizes = adjustProbabilities();
    const totalWeight = weightedPrizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;

    let selectedPrize;
    for (const prize of weightedPrizes) {
      random -= prize.weight;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    const rotations = 5; // Number of full rotations before stopping
    const degreesPerPrize = 360 / prizes.length;
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const finalRotation = rotations * 360 + prizeIndex * degreesPerPrize;
    
    wheelRef.current.style.transition = 'none';
    wheelRef.current.style.transform = `rotate(0deg)`;
    setTimeout(() => {
      wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
      wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
    }, 50);

    setTimeout(() => {
      setSpinning(false);
      setResult(selectedPrize.label);
      
      if (selectedPrize.label.includes('ลุ้นรับทองคำ')) {
        setShowConfetti(true);
        setDialogContent({
          title: '🎉 ยินดีด้วย! 🎉',
          description: 'คุณได้รับโอกาสในการลุ้นรับทองคำ 1 บาท!'
        });
      } else if (selectedPrize.label === 'พบกันปีหน้า' || selectedPrize.label === 'ไม่ได้รับรางวัล') {
        setDialogContent({
          title: '😢 เสียใจด้วย',
          description: selectedPrize.label
        });
      }
      
      setShowDialog(true);

      if (selectedPrize.count !== Infinity) {
        setPrizes(prevPrizes => 
          prevPrizes.map(prize => 
            prize.id === selectedPrize.id ? { ...prize, count: Math.max(0, prize.count - 1) } : prize
          )
        );
      }
    }, 5000);
  };

  const renderWheel = () => {
    return prizes.map((prize, index) => {
      const rotation = (index * 360) / prizes.length;
      return (
        <div
          key={prize.id}
          className="absolute w-full h-full "
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 z-0 rounded-full"
            style={{ backgroundColor: prize.color }}
          ></div>
          <div 
            className="absolute top-8 left-1/2 -translate-x-1/2 text-sm text-center transform -rotate-90 origin-bottom font-bold whitespace-nowrap p-1 rounded "
            style={{ 
              color: prize.textColor,
    
              textShadow: prize.textColor === '#000000' ? '1px 1px 2px rgba(13, 12, 12, 0.5)' : '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {prize.label}
          </div>
        </div>
      );
    });
  };

  const isGameOver = timeLeft <= 0 || remainingSpins <= 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 p-4">
      {showConfetti && <Confetti />}
      <h1 style={{marginBottom:"48px" ,color:"white" , fontWeight:"bold" , fontSize:"40px"}}>Spin For Gold</h1>
      <div className="relative w-96 h-96 mb-8">
        <div className="absolute inset-0 rounded-full bg-red-700"></div>
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `
              0 0 40px 20px rgba(255, 215, 0, 0.5),
              0 0 60px 30px rgba(255, 165, 0, 0.5),
              0 0 80px 40px rgba(255, 69, 0, 0.5),
              0 0 100px 50px rgba(255, 0, 0, 0.5)
            `,
            animation: 'pulse 2s infinite alternate'
          }}
        ></div>
        <LEDRing />
        <div 
          ref={wheelRef}
          className="absolute inset-4 rounded-full border-2 border-yellow-400 overflow-hidden shadow-lg bg-white"
        >
          {renderWheel()}
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-yellow-400 z-20"></div>
        <button
          onClick={spin}
          disabled={spinning || isGameOver}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 hover:bg-yellow-400 text-white p-3 rounded-full z-30 shadow-4xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={Gold} style={{width:"72px", height:"72px"}} />
        </button>
        {/* <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-yellow-400"></div> */}
      </div>
      <div className="mt-4 text-center bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-lg font-bold mb-2">เวลาที่เหลือ: {Math.floor(timeLeft / 3600)}:{Math.floor((timeLeft % 3600) / 60)}:{timeLeft % 60}</p>
        <p className="text-md mb-2">จำนวนการหมุนที่เหลือ: {remainingSpins}</p>
        <p className="text-md font-semibold mb-2">รางวัลที่เหลือ:</p>
        <ul className="mb-4">
          {prizes.map(prize => 
            prize.count !== Infinity && (
              <li key={prize.id} className="text-sm">{prize.label}: {prize.count}</li>
            )
          )}
        </ul>
        {isGameOver && <p className="text-lg font-bold text-red-600 mt-2">เกมสิ้นสุดแล้ว!</p>}
      </div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowDialog(false);
              if (showConfetti) {
                setTimeout(() => setShowConfetti(false), 3000);
              }
            }}>
              ตกลง
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LuckyWheel;