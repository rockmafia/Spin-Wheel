import { useState, useCallback, useRef, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Coins } from "lucide-react";
import Sound from "../public/soundpageone.wav";

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
            // ]

            // [Math.floor(Math.random() * 5)]
          }}
        >
          <div className="text-6xl">🥇</div> {/* <img src={Coins} /> */}
        </div>
      ))}
    </div>
  );
};

export default function SpinningWheelGame() {
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const wheelRef = useRef(null);
  const [prizes, setPrizes] = useState([
    { option: "บัตร Starbucks", count: 25, color: "#af12a1" },
    { option: "บัตร Starbucks", count: 10, color: "#FFFFFF" },
    { option: "Gift Voucher Central 500 บาท", count: 3, color: "#af12a1" },
    {
      option: "เสียใจด้วยคุณไม่ได้รับรางวัล",
      count: Infinity,
      color: "#FFFFFF",
    },
    { option: "บัตร Starbucks", count: 15, color: "#af12a1" },
    {
      option: "เสียใจด้วยค่ะ พบกันปีหน้านะคะ",
      count: Infinity,
      color: "#FFFFFF",
    },
    { option: "Gift Voucher 1000 บาท", count: 2, color: "#af12a1" },
    {
      option: "เสียใจด้วยคุณไม่ได้รับรางวัล",
      count: Infinity,
      color: "#FFFFFF",
    },
  ]);
  const [spins, setSpins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [distributedPrizes, setDistributedPrizes] = useState({
    starbucks25: 0,
    starbucks10: 0,
    voucher500: 0,
    starbucks15: 0,
    voucher1000: 0,
  });
  const spinSoundRef = useRef(null);
  const spinSound = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const spinSoundConglet = useRef(null);
  const spinSoundSad = useRef(null);
  const [isSoundLoaded, setIsSoundLoaded] = useState(true);
  const [isSoundSad, setIsSoundSad] = useState(true);


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

  // Reset spin sound after it finishes playing
  useEffect(() => {
    if (spinSoundRef.current) {
      spinSoundRef.current.addEventListener("ended", () => {
        spinSoundRef.current.currentTime = 0;
      });
    }
    return () => {
      if (spinSoundRef.current) {
        spinSoundRef.current.removeEventListener("ended", () => {
          spinSoundRef.current.currentTime = 0;
        });
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

  const selectPrize = useCallback(() => {
    if (spins < 50) {
      const remainingSpins = 50 - spins;
      const remainingPrizes = [
        { index: 0, remaining: 25 - distributedPrizes.starbucks25 },
        { index: 2, remaining: 1 - (distributedPrizes.voucher500 > 0 ? 1 : 0) },
        {
          index: 6,
          remaining: 1 - (distributedPrizes.voucher1000 > 0 ? 1 : 0),
        },
      ].filter((prize) => prize.remaining > 0);

      const totalRemainingPrizes = remainingPrizes.reduce(
        (sum, prize) => sum + prize.remaining,
        0
      );
      const probability = totalRemainingPrizes / remainingSpins;

      if (remainingPrizes.length > 0 && Math.random() < probability) {
        const randomValue = Math.random() * totalRemainingPrizes;
        let accumulator = 0;

        for (const prize of remainingPrizes) {
          accumulator += prize.remaining;
          if (randomValue <= accumulator) {
            return prize.index;
          }
        }
      }
      return [3, 5, 7][Math.floor(Math.random() * 3)];
    }

    if (spins < 150) {
      const remainingSpins = 150 - spins;
      const remainingPrizes = [
        { index: 1, remaining: 10 - distributedPrizes.starbucks10 },
        {
          index: 2,
          remaining: 2 - Math.max(0, distributedPrizes.voucher500 - 1),
        },
        { index: 4, remaining: 15 - distributedPrizes.starbucks15 },
        {
          index: 6,
          remaining: 1 - Math.max(0, distributedPrizes.voucher1000 - 1),
        },
      ].filter((prize) => prize.remaining > 0);

      const totalRemainingPrizes = remainingPrizes.reduce(
        (sum, prize) => sum + prize.remaining,
        0
      );
      const probability = totalRemainingPrizes / remainingSpins;

      if (remainingPrizes.length > 0 && Math.random() < probability) {
        const randomValue = Math.random() * totalRemainingPrizes;
        let accumulator = 0;

        for (const prize of remainingPrizes) {
          accumulator += prize.remaining;
          if (randomValue <= accumulator) {
            return prize.index;
          }
        }
      }
      return [3, 5, 7][Math.floor(Math.random() * 3)];
    }

    setGameOver(true);
    return -1;
  }, [spins, distributedPrizes]);

  const handleSpinClick = () => {
    if (gameOver || spinning || spins >= 150) return;

    const selectedIndex = selectPrize();
    if (selectedIndex === -1) {
      setGameOver(true);

      return;
    }
    playSpinSound();
    setSpinning(true);

    setSpins((prevSpins) => prevSpins + 1);

    const spinDuration = 5000;
    const spinRotations = 5 + Math.random() * 5;
    const targetRotation =
      360 * spinRotations +
      (360 / prizes.length) * (prizes.length - selectedIndex);

    wheelRef.current.style.transition = `transform ${spinDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;

    setPrizeIndex(selectedIndex);

    setTimeout(() => {
      setSpinning(false);
      setShowResult(true);

      // Check if the selected prize is a "losing" option (update as needed based on your prize indexes)
      if ([3, 5, 7].includes(selectedIndex)) {
        playSpinSoundSad();
      } else {
        // For winning cases, play the congratulatory sound
        playSpinSoundConglet();
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 10000);

        // Update distributed prizes
        setDistributedPrizes((prev) => {
          const newDistributed = { ...prev };
          const updatedPrizes = prizes.map((prize, i) => {
            // สร้างสำเนาของ prize ใหม่เพื่อไม่ให้กระทบค่าของ prize อื่น ๆ
            let updatedPrize = { ...prize };

            // ตรวจสอบ index ของรางวัลที่ชนะ และลดจำนวน count หากรางวัลยังเหลืออยู่
            if (i === selectedIndex && updatedPrize.count > 0) {
              updatedPrize.count--; // ลดจำนวนรางวัลที่เหลือใน updatedPrize.count
              switch (selectedIndex) {
                case 0:
                  newDistributed.starbucks25++;
                  break;
                case 1:
                  newDistributed.starbucks10++;
                  break;
                case 2:
                  newDistributed.voucher500++;
                  break;
                case 4:
                  newDistributed.starbucks15++;
                  break;
                case 6:
                  newDistributed.voucher1000++;
                  break;
              }
            }
            return updatedPrize; // คืนค่ารายการรางวัลที่อัปเดต
          });

          setPrizes(updatedPrizes); // อัปเดต prizes ด้วยรายการที่มี count ใหม่
          return newDistributed;
        });
      }

      if (spins >= 149) {
        setGameOver(true);
      }

      if (spinSound.current) {
        spinSound.current.pause();
        spinSound.current.currentTime = 0;
      }

      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = `rotate(${targetRotation % 360}deg)`;
    }, spinDuration);
  };

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      playSound(); // เรียกใช้ฟังก์ชันที่เล่นเสียง
      setHasInteracted(true);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen  p-4"
      style={{
        backgroundImage: `url(/BjpinwheelVerone.jpg)`,
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
      <audio ref={audioRef} src={Sound} loop />

      <div className="text-lg mt-[40rem] text-black">จำนวนการหมุน: {spins}</div>
      <div className=" relative" style={{ width: "800px", height: "800px" }}>
        <svg width="800" height="800" viewBox="0 0 400 400">
          <defs>
            <linearGradient
              id="goldGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <filter id="goldEffect">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <feSpecularLighting
                in="blur"
                surfaceScale="5"
                specularConstant=".75"
                specularExponent="20"
                lightingColor="#FFF5CC"
                result="specOut"
              >
                <fePointLight x="200" y="200" z="200" />
              </feSpecularLighting>
              <feComposite
                in="specOut"
                in2="SourceAlpha"
                operator="in"
                result="specOut"
              />
              <feComposite
                in="SourceGraphic"
                in2="specOut"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="1"
                k4="0"
                result="litPaint"
              />
            </filter>
            <filter id="wheelGlow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood
                floodColor="#FFD700"
                floodOpacity="0.5"
                result="glowColor"
              />
              <feComposite
                in="glowColor"
                in2="blur"
                operator="in"
                result="softGlow"
              />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient
              id="ledGlow"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="#FFFF00" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFF00" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g>
            <circle
              cx="200"
              cy="200"
              r="195"
              fill="url(#goldGradient)"
              filter="url(#wheelGlow)"
            />

            {Array.from({ length: 30 }).map((_, index) => {
              const angle = (index / 30) * 2 * Math.PI;
              const x = 200 + 185 * Math.cos(angle);
              const y = 200 + 185 * Math.sin(angle);
              const isLargeLight = [1, 5, 10, 15, 20, 25, 30].includes(
                index + 1
              );
              const outerRadius = isLargeLight ? 12 : 6;
              const innerRadius = isLargeLight ? 6 : 3;
              return (
                <g key={index}>
                  <circle cx={x} cy={y} r={outerRadius} fill="url(#ledGlow)">
                    <animate
                      attributeName="opacity"
                      values="1;0.3;1"
                      dur={isLargeLight ? "1.5s" : "2s"}
                      repeatCount="indefinite"
                      begin={`${index * 0.08}s`}
                    />
                  </circle>
                  <circle cx={x} cy={y} r={innerRadius} fill="#FFFF00" />
                </g>
              );
            })}

            <circle cx="200" cy="200" r="175" fill="#FFFFFF" />

            <g ref={wheelRef} style={{ transformOrigin: "center" }}>
              {prizes.map((prize, index) => {
                const angle = (index / prizes.length) * 2 * Math.PI;
                const nextAngle = ((index + 1) / prizes.length) * 2 * Math.PI;
                const x1 = 200 + 175 * Math.cos(angle);
                const y1 = 200 + 175 * Math.sin(angle);
                const x2 = 200 + 175 * Math.cos(nextAngle);
                const y2 = 200 + 175 * Math.sin(nextAngle);
                const midAngle = (angle + nextAngle) / 2;
                const labelRadius = 120;
                const labelX = 200 + labelRadius * Math.cos(midAngle);
                const labelY = 200 + labelRadius * Math.sin(midAngle);
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
                      transform={`rotate(${
                        ((index + 0.5) * 360) / prizes.length
                      }, ${labelX}, ${labelY})`}
                    >
                      {prize.option.length > 15
                        ? prize.option.slice(0, 12) + "..."
                        : prize.option}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>

          <g
            className="cursor-pointer"
            onClick={handleSpinClick}
            style={{ pointerEvents: gameOver || spinning ? "none" : "auto" }}
          >
            <circle
              cx="200"
              cy="200"
              r="40"
              fill="url(#goldGradient)"
              filter="url(#goldEffect)"
            />
            <circle
              cx="200"
              cy="200"
              r="35"
              fill="url(#goldGradient)"
              filter="url(#goldEffect)"
            />
            <foreignObject x="170" y="170" width="60" height="60">
              <div className="h-full w-full flex items-center justify-center">
                <Coins
                  className={`w-8 h-8 ${spinning ? "animate-spin" : ""}`}
                  color={gameOver ? "#666666" : "#FFD700"}
                />
              </div>
            </foreignObject>
          </g>

          {/* <polygon
            points="380,200 395,190 395,210"
            fill="url(#goldGradient)"
            filter="url(#goldEffect)"
            transform="rotate(90, 390, 200)"
          /> */}
        </svg>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-[30rem] bg-yellow-600 justify-center p-8 rounded-2xl">
        {prizes
          .filter((_, index) => ![3, 5, 7].includes(index))
          .map((prize, index) => (
            <div key={index} className="bg-black p-2 rounded shadow text-white">
              <div>
                {index + 1}. {prize.option}
              </div>
              <div>: {prize.count} รางวัล</div>
            </div>
          ))}
      </div>
      <AlertDialog open={showResult} onOpenChange={setShowResult}>
        <AlertDialogContent className="bg-yellow-400 text-white h-[20rem] max-w-full ">
          <AlertDialogHeader>
            <AlertDialogTitle>ผลรางวัล</AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              คุณได้รับ: {prizes[prizeIndex].option}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button onClick={() => setShowResult(false)}
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
}
