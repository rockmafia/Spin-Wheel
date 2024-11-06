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
import Sound from "../public/soundpageone.wav"


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
            backgroundColor: [][Math.floor(Math.random() * 5)],
            // backgroundColor: [
            //   "#ff0000",
            //   "#00ff00",
            //   "#0000ff",
            //   "#ffff00",
            //   "#ff00ff",
            // ][Math.floor(Math.random() * 5)]
          }}
        >
          <div className='text-xl'>🟡🟡</div>
        </div>
      ))}
    </div>
  );
};


const initialPrizes = [
  { id: 1, label: 'คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท', count: 0, color: '#FFD700', textColor: '#000000', isReal: true },
  { id: 2, label: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#000000', textColor: '#FFFFFF', isReal: false },
  { id: 3, label: 'คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท', count: 0, color: '#FFD700', textColor: '#000000', isReal: false },
  { id: 4, label: 'คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท', count: 0, color: '#FFD700', textColor: '#000000', isReal: false },
  { id: 5, label: 'เสียใจด้วยค่ะ พบกันใหม่พรุ่งนี้นะคะ', count: Infinity, color: '#000000', textColor: '#FFFFFF', isReal: false },
  { id: 6, label: 'คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท', count: 0, color: '#FFD700', textColor: '#000000', isReal: false },
  { id: 7, label: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#000000', textColor: '#FFFFFF', isReal: false }
];

const TOTAL_SPINS = 80;
const TOTAL_TIME = 6 * 60 * 60;
const TOTAL_LEDS = 35;
const BRIGHTER_LEDS = [0, 4, 9, 14, 19, 24, 29, 34];

const SpinCounter = ({ total, remaining }) => (
  <div className="text-white mb-4 text-center ">
    <span className="text-lg">จำนวนการหมุน: </span>
    <span className="text-2xl font-bold">
      {total - remaining}
    </span>
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
        className={`absolute inset-[-0.5rem] rounded-full transition-opacity duration-300  ${isOn ? 'opacity-90 z-10' : 'opacity-0'}`}
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
  const spinSoundRef = useRef(null);
  const [dialogContent, setDialogContent] = useState({ title: '', description: '' });
  const wheelRef = useRef(null);
  const spinSoundConglet = useRef(null);
  const [isSoundLoaded, setIsSoundLoaded] = useState(true);
  const spinSoundSad = useRef(null);
  const [isSoundSad, setIsSoundSad] = useState(true);
  const audioRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);


  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  const playSound = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(0.5, audioContextRef.current.currentTime); // ลดเสียงลง 50%

      const response = await fetch(Sound);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
      source.start(0);
    }
  };


  useEffect(() => {
    // Create new Audio object for spin sound
    spinSoundRef.current = new Audio("/spin-sound.mp3"); // ตรวจสอบให้แน่ใจว่าไฟล์เสียงอยู่ในโฟลเดอร์ public
    
    // Preload the sound
    spinSoundRef.current.load();
    
    return () => {
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current = null;
      }
    };
  }, []);

  const playSpinSound = () => {
    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0; // Reset sound to start
      spinSoundRef.current.play().catch(error => {
        console.error("Error playing spin sound:", error);
      });
    }
  };

  useEffect(() => {
    spinSoundConglet.current = new Audio("../sound-conglet.mp3");
    spinSoundConglet.current.addEventListener("canplaythrough", () =>
      setIsSoundLoaded(true)
    );
    spinSoundConglet.current.addEventListener("error", (e) =>
      console.error("Error loading sound:", e)
    );

    return () => {
      if (spinSoundConglet.current) {
        spinSoundConglet.current.removeEventListener("canplaythrough", () =>
          setIsSoundLoaded(true)
        );
        spinSoundConglet.current.removeEventListener("error", (e) =>
          console.error("Error loading sound:", e)
        );
      }
    };
  }, []);

  const playSpinSoundConglet = () => {
    if (spinSoundConglet.current && isSoundLoaded) {
      spinSoundConglet.current.currentTime = 0;
      spinSoundConglet.current
        .play()
        .catch((e) => console.error("Error playing sound:", e));
    } else {
      console.warn("Spin sound not loaded yet");
    }
  };

  const playSpinSoundSad = () => {
    if (spinSoundSad.current && isSoundSad) {
      spinSoundSad.current.currentTime = 0;
      spinSoundSad.current
        .play()
        .catch((e) => console.error("Error playing sound:", e));
    } else {
      console.warn("Spin sound not loaded yet");
    }
  };

  useEffect(() => {
    spinSoundSad.current = new Audio("../gameover.wav");
    spinSoundSad.current.addEventListener("canplaythrough", () =>
    setIsSoundSad(true)
    );
    spinSoundSad.current.addEventListener("error", (e) =>
      console.error("Error loading sound:", e)
    );

    return () => {
      if (spinSoundSad.current) {
        spinSoundSad.current.removeEventListener("canplaythrough", () =>
        setIsSoundSad(true)
        );
        spinSoundSad.current.removeEventListener("error", (e) =>
          console.error("Error loading sound:", e)
        );
      }
    };
  }, []);
  
  
  
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
    playSpinSound();
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
        playSpinSoundConglet();
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
        setShowConfetti(true);
      } else {
        playSpinSoundSad();
        setDialogContent({
          title: '😢 เสียใจด้วย',
          description: selectedPrize.label
        });
      }
      
      setShowDialog(true);
    }, 5000);
  };

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      playSound();
      setHasInteracted(true);
    }
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
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1/2"
            style={{ backgroundColor: prize.color }}
          ></div>
          <div 
            className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl text-center transform -rotate-90 origin-bottom font-bold whitespace-nowrap p-1 rounded"
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 p-4 "
    style={{
      backgroundImage: `url(/BJLuckySpinWheel-new.jpg)`,
      backgroundSize: "auto",
    }}
    onClick={handleUserInteraction}
    >
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
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      <Confetti active={showConfetti} />
      {/* <audio ref={audioRef} src={Sound} loop  /> */}
      <SpinCounter total={TOTAL_SPINS} remaining={remainingSpins} />
      
      <div className="relative w-[43rem] h-[43rem] mb-8 mt-[52rem]  ">
        <div className="absolute inset-0 rounded-full bg-red-700  "></div>
        <div 
          className="absolute inset-0 rounded-full  "
          style={{
            boxShadow: '0 0 40px 20px rgba(255, 215, 0, 0.5), 0 0 60px 30px rgba(255, 165, 0, 0.5), 0 0 80px 40px rgba(255, 69, 0, 0.5), 0 0 100px 50px rgba(255, 0, 0, 0.5)'
          }}
        ></div>
        <LEDRing />
        <div 
          ref={wheelRef}
          className="absolute inset-4 rounded-full overflow-hidden shadow-lg bg-white  "
        >
          {renderWheel()}
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-yellow-400 z-20"></div>
        <button
          onClick={spin}
          disabled={spinning || isGameOver}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-white p-3 rounded-full z-30 shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Coins size={80} />
        </button>
      </div>

      <div className="text-white text-center mt-[20rem] bg-red-800 p-4 rounded-md">
        <p className="text-2xl font-semibold mb-2">รางวัลที่เหลือ:</p>
        <div className="text-4xl">
          คุณได้สิทธิ์ลุ้นรับทองคำ 1 บาท: {prizes[0].count} รางวัล
        </div>
        {isGameOver && <p className="text-xl font-bold text-yellow-400 mt-2">เกมสิ้นสุดแล้ว!</p>}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog} >
        <AlertDialogContent className="bg-yellow-400 text-white h-[20rem] max-w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          <button onClick={() => setShowDialog(false)}
              type="button"
              class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="sr-only">Close</span>
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LuckyWheel;