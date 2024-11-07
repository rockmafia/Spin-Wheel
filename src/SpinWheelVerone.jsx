import { useState, useCallback, useRef,useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Coins } from "lucide-react";
import Sound from "../public/soundpageone.wav";


const TOTAL_SPINS_LIMIT = 100;
const FIRST_PHASE_LIMIT = 50;
const SPIN_DURATION = 5000;

const Confetti = ({ active }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animation: "fall 3s linear infinite"
          }}
        >
          <div className="text-6xl">🥇</div>
        </div>
      ))}
    </div>
  );
};

export default function SpinningWheelGame() {
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [spins, setSpins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const wheelRef = useRef(null);
  const spinSoundRef = useRef(null);
  const spinSoundConglet = useRef(null);
  const [isSoundLoaded, setIsSoundLoaded] = useState(true);
  const spinSoundSad = useRef(null);
  const [isSoundSad, setIsSoundSad] = useState(true);
  const audioRef = useRef(null);

  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  const playSound = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(0.3, audioContextRef.current.currentTime); // ลดเสียงลง 50%

      const response = await fetch(Sound);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
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
      spinSoundRef.current.play().catch((error) => {
        console.error("Error playing spin sound:", error);
      });
    }
  };

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





  const [prizes] = useState([
    { option: "บัตร Starbucks", color: "#af12a1" },
    { option: "บัตร Starbucks", color: "#FFFFFF" },
    { option: "Gift Voucher Central 500 บาท", color: "#af12a1" },
    { option: "เสียใจด้วยคุณไม่ได้รับรางวัล", color: "#FFFFFF" },
    { option: "บัตร Starbucks", color: "#af12a1" },
    { option: "เสียใจด้วยค่ะ พบกันปีหน้านะคะ", color: "#FFFFFF" },
    { option: "Gift Voucher 1000 บาท", color: "#af12a1" },
    { option: "เสียใจด้วยคุณไม่ได้รับรางวัล", color: "#FFFFFF" }
  ]);

  const [prizeDistribution, setPrizeDistribution] = useState({
    firstPhase: {
      prize1: 0,  // All 40 prizes in first phase
      prize2: 0,   // No prizes in first phase
      prize3: 0,   // 2 prizes in first phase
      prize5: 0,   // No prizes in first phase (changed from 10)
      prize7: 1    // 1 prize in first phase
    },
    secondPhase: {
      prize1: 0,   // No prizes in second phase
      prize2: 0,  // All 20 prizes in second phase
      prize3: 0,   // 2 prizes in second phase
      prize5: 0,  // All 20 prizes in second phase (changed from 10)
      prize7: 0    // 1 prize in second phase
    }
  });

  const selectPrize = useCallback(() => {
    if (spins >= TOTAL_SPINS_LIMIT) {
      setGameOver(true);
      return -1;
    }

    const isFirstPhase = spins < FIRST_PHASE_LIMIT;
    const phase = isFirstPhase ? 'firstPhase' : 'secondPhase';
    const distribution = prizeDistribution[phase];

    const remainingSpins = isFirstPhase ? 
      FIRST_PHASE_LIMIT - spins : 
      TOTAL_SPINS_LIMIT - spins;

    // Total remaining prizes in this phase
    const totalPrizes = Object.values(distribution).reduce((a, b) => a + b, 0);
    
    // Force prize selection if we need to ensure distribution
    if (totalPrizes >= remainingSpins) {
      const prizeTypes = ['prize1', 'prize2', 'prize3', 'prize5', 'prize7'];
      const availablePrizes = prizeTypes.filter(type => distribution[type] > 0);
      
      if (availablePrizes.length > 0) {
        const selectedType = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
        setPrizeDistribution(prev => ({
          ...prev,
          [phase]: {
            ...prev[phase],
            [selectedType]: prev[phase][selectedType] - 1
          }
        }));

        // Convert prize type to index
        switch (selectedType) {
          case 'prize1': return 0;
          case 'prize2': return 1;
          case 'prize3': return 2;
          case 'prize5': return 4;
          case 'prize7': return 6;
        }
      }
    }

    // Normal probability-based selection
    const random = Math.random() * remainingSpins;
    let cumulativeProbability = 0;

    if (distribution.prize1 > 0) {
      cumulativeProbability += distribution.prize1;
      if (random < cumulativeProbability) {
        setPrizeDistribution(prev => ({
          ...prev,
          [phase]: { ...prev[phase], prize1: prev[phase].prize1 - 1 }
        }));
        return 0;
      }
    }

    if (distribution.prize2 > 0) {
      cumulativeProbability += distribution.prize2;
      if (random < cumulativeProbability) {
        setPrizeDistribution(prev => ({
          ...prev,
          [phase]: { ...prev[phase], prize2: prev[phase].prize2 - 1 }
        }));
        return 1;
      }
    }

    if (distribution.prize3 > 0) {
      cumulativeProbability += distribution.prize3;
      if (random < cumulativeProbability) {
        setPrizeDistribution(prev => ({
          ...prev,
          [phase]: { ...prev[phase], prize3: prev[phase].prize3 - 1 }
        }));
        return 2;
      }
    }

    if (distribution.prize5 > 0) {
      cumulativeProbability += distribution.prize5;
      if (random < cumulativeProbability) {
        setPrizeDistribution(prev => ({
          ...prev,
          [phase]: { ...prev[phase], prize5: prev[phase].prize5 - 1 }
        }));
        return 4;
      }
    }

    if (distribution.prize7 > 0) {
      cumulativeProbability += distribution.prize7;
      if (random < cumulativeProbability) {
        setPrizeDistribution(prev => ({
          ...prev,
          [phase]: { ...prev[phase], prize7: prev[phase].prize7 - 1 }
        }));
        return 6;
      }
    }

    return [3, 5, 7][Math.floor(Math.random() * 3)];
  }, [spins, prizeDistribution]);

  const getTotalRemainingPrizes = (prizeIndex) => {
    if ([3, 5, 7].includes(prizeIndex)) return "∞";
    
    const phase1 = prizeDistribution.firstPhase;
    const phase2 = prizeDistribution.secondPhase;
    
    switch(prizeIndex) {
      case 0: return phase1.prize1 + phase2.prize1;
      case 1: return phase1.prize2 + phase2.prize2;
      case 2: return phase1.prize3 + phase2.prize3;
      case 4: return phase1.prize5 + phase2.prize5;
      case 6: return phase1.prize7 + phase2.prize7;
      default: return 0;
    }
  };

  const handleSpinClick = () => {
    if (gameOver || spinning || spins >= TOTAL_SPINS_LIMIT) return;
    playSound();
    const selectedIndex = selectPrize();
    if (selectedIndex === -1) {
      setGameOver(true);
      return;
    }

    setSpinning(true);
    playSpinSound();
    
    setSpins(prev => prev + 1);

    const spinRotations = 5 + Math.random() * 5;
    const targetRotation = 360 * spinRotations + (360 / prizes.length) * (prizes.length - selectedIndex);

    wheelRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;
    setPrizeIndex(selectedIndex);

    setTimeout(() => {
      setSpinning(false);
      setShowResult(true);

      if (![3, 5, 7].includes(selectedIndex)) {
        setShowConfetti(true);
        playSpinSoundConglet();
        setTimeout(() => setShowConfetti(false), 10000);
      }else{
        playSpinSoundSad();
      }

      if (spins >= TOTAL_SPINS_LIMIT - 1) {
        setGameOver(true);
      }

      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = `rotate(${targetRotation % 360}deg)`;
    }, SPIN_DURATION);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{ backgroundImage: "url(/BjpinwheelVerone.jpg)", backgroundSize: "auto" }}
      onClick={() => !hasInteracted && setHasInteracted(true)}
    >
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      <Confetti active={showConfetti} />
      <audio ref={audioRef} src={Sound} loop />
      
      <div className="text-lg mt-[40rem] text-black">จำนวนการหมุน: {spins}</div>
      
      <div className="relative w-[800px] h-[800px]">
        <svg width="800" height="800" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          
          <g>
            <circle cx="200" cy="200" r="195" fill="url(#goldGradient)" />
            <g ref={wheelRef} style={{ transformOrigin: "center" }}>
              {prizes.map((prize, index) => {
                const angle = (index / prizes.length) * 2 * Math.PI;
                const nextAngle = ((index + 1) / prizes.length) * 2 * Math.PI;
                const x1 = 200 + 175 * Math.cos(angle);
                const y1 = 200 + 175 * Math.sin(angle);
                const x2 = 200 + 175 * Math.cos(nextAngle);
                const y2 = 200 + 175 * Math.sin(nextAngle);
                const midAngle = (angle + nextAngle) / 2;
                const labelX = 200 + 120 * Math.cos(midAngle);
                const labelY = 200 + 120 * Math.sin(midAngle);

                return (
                  <g key={index}>
                    <path
                      d={`M200,200 L${x1},${y1} A175,175 0 0,1 ${x2},${y2} Z`}
                      fill={prize.color}
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={index % 2 === 0 ? "#FFFFFF" : "#af12a1"}
                      fontSize="16"
                      fontWeight="bold"
                      transform={`rotate(${((index + 0.5) * 360) / prizes.length}, ${labelX}, ${labelY})`}
                    >
                      {prize.option.length > 15 ? `${prize.option.slice(0, 12)}...` : prize.option}
                    </text>
                  </g>
                );
              })}
            </g>
            
            <g
              className="cursor-pointer"
              onClick={handleSpinClick}
              style={{ pointerEvents: gameOver || spinning ? "none" : "auto" }}
            >
              <circle cx="200" cy="200" r="40" fill="url(#goldGradient)" />
              <foreignObject x="170" y="170" width="60" height="60">
                <div className="h-full w-full flex items-center justify-center">
                  <Coins className={`w-8 h-8 ${spinning ? "animate-spin" : ""}`} color={gameOver ? "#666666" : "#FFD700"} />
                </div>
              </foreignObject>
            </g>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-[30rem] bg-yellow-600 justify-center p-8 rounded-2xl">
        {prizes
          .filter((_, index) => ![3, 5, 7].includes(index))
          .map((prize, index) => {
            const origIndex = index === 0 ? 0 : index === 1 ? 1 : index === 2 ? 2 : index === 3 ? 4 : 6;
            return (
              <div key={index} className="bg-black p-2 rounded shadow text-white">
                <div>{index + 1}. {prize.option}</div>
                <div>: {getTotalRemainingPrizes(origIndex)} รางวัล</div>
              </div>
            );
          })}
      </div>

      <AlertDialog open={showResult} onOpenChange={setShowResult}>
        <AlertDialogContent className="bg-yellow-400 text-white h-[20rem] max-w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>ผลรางวัล</AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              คุณได้รับ: {prizes[prizeIndex].option}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <button 
            onClick={() => setShowResult(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2"
          >
            ✕
          </button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
  }
