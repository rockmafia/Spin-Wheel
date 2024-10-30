import React, { useState, useEffect, useRef } from 'react';
import { Coins } from 'lucide-react';
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
  { id: 1, label: 'คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท', count: 10, color: '#FFD700', textColor: '#000000', isReal: true },
  { id: 2, label: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#000000', textColor: '#FFFFFF', isReal: false },
  { id: 3, label: 'คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท', count: 0, color: '#FFD700', textColor: '#000000', isReal: false },
  { id: 4, label: 'คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท', count: 0, color: '#FFD700', textColor: '#000000', isReal: false },
  { id: 5, label: 'เสียใจด้วยค่ะ พบกันใหม่พรุ่งนี้นะคะ', count: Infinity, color: '#000000', textColor: '#FFFFFF', isReal: false },
  { id: 6, label: 'คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท', count: 0, color: '#FFD700', textColor: '#000000', isReal: false },
  { id: 7, label: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#000000', textColor: '#FFFFFF', isReal: false }
];

const TOTAL_SPINS = 40;
const TOTAL_TIME = 6 * 60 * 60;
const TOTAL_LEDS = 35;
const BRIGHTER_LEDS = [0, 4, 9, 14, 19, 24, 29, 34];

const SpinCounter = ({ total, remaining }) => (
  <div className="text-white mb-4 text-center">
    <span className="text-lg">จำนวนการหมุน: </span>
    <span className="text-2xl font-bold">
      {total - remaining}
    </span>
  </div>
);

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-50">
    {[...Array(100)].map((_, index) => (
      <div
        key={index}
        className="absolute animate-[confetti-fall_5s_linear_infinite]"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-5%`,
          animationDelay: `${Math.random() * 5}s`,
          backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
          width: '10px',
          height: '10px'
        }}
      />
    ))}
  </div>
);

const LED = ({ index }) => {
  const [isOn, setIsOn] = useState(false);
  const isBrighter = BRIGHTER_LEDS.includes(index);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOn(prev => !prev);
    }, Math.random() * 1000 + 500);

    return () => clearInterval(interval);
  }, []);

  const angle = (index / TOTAL_LEDS) * 360;
  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isBrighter ? 'w-4 h-4' : 'w-2 h-2'}`}
      style={{
        top: `${50 + 48 * Math.sin((angle * Math.PI) / 180)}%`,
        left: `${50 + 48 * Math.cos((angle * Math.PI) / 180)}%`
      }}
    >
      <div className={`w-full h-full rounded-full ${isBrighter ? 'bg-yellow-200' : 'bg-yellow-300'}`}></div>
      <div 
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${isOn ? 'opacity-90' : 'opacity-0'}`}
        style={{
          backgroundColor: isBrighter ? '#fde68a' : '#fcd34d',
          boxShadow: isBrighter
            ? '0 0 10px #fde68a, 0 0 20px #fde68a, 0 0 30px #fde68a, 0 0 40px #fde68a, 0 0 70px #fde68a'
            : '0 0 5px #fcd34d',
          filter: isBrighter ? 'brightness(1.5)' : 'none'
        }}
      ></div>
    </div>
  );
};

const LEDRing = () => (
  <div className="absolute w-full h-full">
    {[...Array(TOTAL_LEDS)].map((_, index) => (
      <LED key={index} index={index} />
    ))}
  </div>
);

const LuckyWheel = () => {
  const [prizes, setPrizes] = useState(initialPrizes);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [remainingSpins, setRemainingSpins] = useState(TOTAL_SPINS);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', description: '' });
  const wheelRef = useRef(null);

  const shouldGiveRealPrize = () => {
    const realPrize = prizes.find(p => p.id === 1);
    const remainingPrizes = realPrize.count;
    const remainingSpinsForPrizes = remainingSpins;
    
    // If there are no more real prizes, return false
    if (remainingPrizes <= 0) return false;
    
    // Calculate the probability to ensure all prizes are given within remaining spins
    const probability = remainingPrizes / remainingSpinsForPrizes;
    
    return Math.random() < probability;
  };

  const spin = () => {
    if (spinning || remainingSpins <= 0) return;

    setSpinning(true);
    setRemainingSpins(prevSpins => prevSpins - 1);

    // Determine if this spin should give a real prize
    const willGiveRealPrize = shouldGiveRealPrize();

    let selectedPrize;
    if (willGiveRealPrize) {
      // Give the real prize (slot 1)
      selectedPrize = prizes[0];
    } else {
      // Only select from losing slots (2, 5, 7)
      const losingSlots = [prizes[1], prizes[4], prizes[6]];
      selectedPrize = losingSlots[Math.floor(Math.random() * losingSlots.length)];
    }

    const rotations = 5;
    const degreesPerPrize = 360 / prizes.length;
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const finalRotation = rotations * 360 + prizeIndex * degreesPerPrize;
    
    wheelRef.current.style.transition = 'none';
    wheelRef.current.style.transform = 'rotate(0deg)';
    setTimeout(() => {
      wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
      wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
    }, 50);

    setTimeout(() => {
      setSpinning(false);
      setResult(selectedPrize.label);
      
      if (selectedPrize.isReal) {
        setShowConfetti(true);
        setDialogContent({
          title: '🎉 ยินดีด้วย! 🎉',
          description: selectedPrize.label
        });
        // Decrease the count of real prizes
        setPrizes(prevPrizes => 
          prevPrizes.map(prize => 
            prize.id === 1 ? { ...prize, count: prize.count - 1 } : prize
          )
        );
      } else {
        setDialogContent({
          title: '😢 เสียใจด้วย',
          description: selectedPrize.label
        });
      }
      
      setShowDialog(true);
    }, 5000);
  };

  const renderWheel = () => {
    return prizes.map((prize, index) => {
      const rotation = (index * 360) / prizes.length;
      return (
        <div
          key={prize.id}
          className="absolute w-full h-full"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2"
            style={{ backgroundColor: prize.color }}
          ></div>
          <div 
            className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-center transform -rotate-90 origin-bottom font-bold whitespace-nowrap p-1 rounded"
            style={{ 
              color: prize.textColor,
              backgroundColor: prize.color,
              textShadow: prize.textColor === '#000000' ? '1px 1px 2px rgba(255,255,255,0.5)' : '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {prize.label}
          </div>
        </div>
      );
    });
  };

  const isGameOver = remainingSpins <= 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 p-4 ">
      {showConfetti && <Confetti />}
      
      <SpinCounter total={TOTAL_SPINS} remaining={remainingSpins} />
      
      <div className="relative w-96 h-96 mb-8">
        <div className="absolute inset-0 rounded-full bg-red-700"></div>
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: '0 0 40px 20px rgba(255, 215, 0, 0.5), 0 0 60px 30px rgba(255, 165, 0, 0.5), 0 0 80px 40px rgba(255, 69, 0, 0.5), 0 0 100px 50px rgba(255, 0, 0, 0.5)'
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
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-white p-3 rounded-full z-30 shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Coins size={24} />
        </button>
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-yellow-400"></div>
      </div>

      <div className="text-white text-center">
        <p className="text-lg font-semibold mb-2">รางวัลที่เหลือ:</p>
        <div className="text-lg">
          คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท: {prizes[0].count} รางวัล
        </div>
        {isGameOver && <p className="text-xl font-bold text-yellow-400 mt-2">เกมสิ้นสุดแล้ว!</p>}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog} >
        <AlertDialogContent className="bg-white rounded-lg	text-black">
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
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