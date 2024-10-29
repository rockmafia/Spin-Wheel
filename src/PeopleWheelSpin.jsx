import React, { useState, useEffect, useRef } from "react";
import { Coins } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Sound from "../public/sound-effect.wav"

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
            backgroundColor: [
              "#ff0000",
              "#00ff00",
              "#0000ff",
              "#ffff00",
              "#ff00ff",
            ][Math.floor(Math.random() * 5)]
          }}
        >
          
        </div>
      ))}
    </div>
  );
};


const TOTAL_LEDS = 35;
const BRIGHTER_LEDS = [0, 4, 9, 14, 19, 24, 29, 34];

const LED = ({ index }) => {
  const [isOn, setIsOn] = useState(false);
  const isBrighter = BRIGHTER_LEDS.includes(index);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOn((prev) => !prev);
    }, Math.random() * 1000 + 500);

    return () => clearInterval(interval);
  }, []);

  const angle = (index / TOTAL_LEDS) * 360;
  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
        isBrighter ? "w-4 h-4" : "w-2 h-2"
      }`}
      style={{
        top: `${50 + 48 * Math.sin((angle * Math.PI) / 180)}%`,
        left: `${50 + 48 * Math.cos((angle * Math.PI) / 180)}%`,
      }}
    >
      <div
        className={`w-full h-full rounded-full ${
          isBrighter ? "bg-yellow-200" : "bg-yellow-300"
        }`}
      ></div>
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
          isOn ? "opacity-90" : "opacity-0"
        }`}
        style={{
          backgroundColor: isBrighter ? "#DAA520" : "#B8860B",
          boxShadow: isBrighter
            ? `0 0 10px #DAA520, 0 0 20px #DAA520, 0 0 30px #DAA520`
            : `0 0 5px #B8860B`,
          filter: isBrighter ? "brightness(1.5)" : "none",
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

const PrizePin = () => (
  <div
    className="absolute z-50"
    style={{
      top: "2%",
      right: "2%",
      transform: "rotate(45deg)",
    }}
  >
    <div className="relative xl:w-[10rem] h-12 w-12 ">
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full"
        style={{
          background: "linear-gradient(145deg, #ff0000, #cc0000)",
          boxShadow: `
            0 3px 6px rgba(0,0,0,0.3),
            0 6px 12px rgba(0,0,0,0.2),
            inset 0 -3px 6px rgba(0,0,0,0.2),
            inset 0 3px 6px rgba(255,255,255,0.3)
          `,
          border: "2px solid #ff3333",
        }}
      >
        <div
          className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1))",
            filter: "blur(1px)",
          }}
        />
      </div>
      <div
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "24px solid #cc0000",
          filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.3))",
        }}
      >
        <div
          className="absolute top-[-24px] left-[-1.5px] w-0 h-0"
          style={{
            borderLeft: "1.5px solid transparent",
            borderRight: "1.5px solid transparent",
            borderTop: "24px solid rgba(255,255,255,0.2)",
          }}
        />
      </div>
    </div>
  </div>
);

const Circle = ({ isSpinning, spinDegrees }) => {
  const sections = [
    "คุณ A\nจากบริษัท AA",
    "คุณ B\nจากบริษัท BB",
    "คุณ C\nจากบริษัท CC",
    "คุณ D\nจากบริษัท DD",
    "คุณ E\nจากบริษัท EE",
    "คุณ F\nจากบริษัท FF",
    "คุณ G\nจากบริษัท GG",
    "คุณ H\nจากบริษัท HH",
    "คุณ I\nจากบริษัท II",
    "คุณ J\nจากบริษัท JJ",
  ];

  return (
    <div
      className="relative w-full h-full transition-transform"
      style={{
        transform: `rotate(${spinDegrees}deg)`,
        transition: isSpinning
          ? "transform 30s cubic-bezier(0.2, 0.8, 0.2, 1)"
          : "none",
      }}
    >
      <div
        className="absolute w-full h-full"
        style={{
          background: `conic-gradient(from 0deg, ${Array(sections.length)
            .fill()
            .map(
              (_, i) =>
                `${i % 2 === 0 ? "#e50305" : "#fff4e3"} ${
                  i * (100 / sections.length)
                }% ${(i + 1) * (100 / sections.length)}%`
            )
            .join(", ")})`,
          borderRadius: "50%",
        }}
      />
      {sections.map((text, index) => {
        const sectionAngle = 360 / sections.length;
        const startAngle = index * sectionAngle;
        const textAngle = startAngle;
        const radius = 34;
        const rad = (textAngle * Math.PI) / 180;
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);

        const [line1, line2] = text.split("\n");

        return (
          <div
            key={index}
            className="absolute text-center"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${textAngle}deg)`,
              fontSize: "0.7rem",
              fontWeight: "bold",
              color: index % 2 === 0 ? "#fff4e3" : "#e50305",
              textShadow:
                index % 2 === 0
                  ? "1px 1px 2px rgba(0,0,0,0.8)"
                  : "1px 1px 2px rgba(255,255,255,0.5)",
              width: "80px",
              lineHeight: "1.1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "2px",
              transformOrigin: "center center",
            }}
          >
            <div>{line1}</div>
            <div>{line2}</div>
          </div>
        );
      })}
    </div>
  );
};

const LuckyWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDegrees, setSpinDegrees] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState("");
  const audioRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const spinSound = useRef(null);
  const [isSoundLoaded, setIsSoundLoaded] = useState(true);
  const spinSoundRef = useRef(null);
  const spinSoundConglet = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);



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
    spinSoundConglet.current = new Audio("../AudienceSoundEffect.wav");
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

  const sections = [
    "คุณ A จากบริษัท AA",
    "คุณ B จากบริษัท BB",
    "คุณ C จากบริษัท CC",
    "คุณ D จากบริษัท DD",
    "คุณ E จากบริษัท EE",
    "คุณ F จากบริษัท FF",
    "คุณ G จากบริษัท GG",
    "คุณ H จากบริษัท HH",
    "คุณ I จากบริษัท II",
    "คุณ J จากบริษัท JJ",
  ];

  const spinWheel = () => {
    if (!isSpinning) {
      setIsSpinning(true);
     
      playSpinSound();

      const winningIndex = Math.floor(Math.random() * sections.length);
      const sectionSize = 360 / sections.length;

      const spins = 5 + Math.floor(Math.random() * 5);
      const targetDegrees =
        360 - winningIndex * sectionSize - sectionSize / 2 - 45;
      const totalDegrees = spins * 360 + targetDegrees;
      setIsSoundLoaded(true);
      setSpinDegrees(totalDegrees);
      setWinner(sections[winningIndex]);
      
      setTimeout(() => {
        setIsSpinning(false);
        setShowConfetti(true);
        setShowResult(true);
        playSpinSoundConglet(true);
        if (spinSound.current) {
          spinSound.current.pause();
          spinSound.current.currentTime = 0;
        }
      }, 30000);
    }
    
    
  };

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      audioRef.current.play().catch(err => {
        console.error("Error playing background sound:", err);
      });
      setHasInteracted(true);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] p-4"
      style={{
        backgroundImage: `url(/Bjbg.jpg)`,
        backgroundSize: "auto",
      }}
      onClick={handleUserInteraction}>
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
      <playSpinSoundConglet active={isSoundLoaded} />
      <audio ref={audioRef} src={Sound}  />
      <div className="relative xl:w-[34rem] xl:h-[34rem] xl:mt-[21rem] w-80 h-80  "
      
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(145deg, #B8860B, #8B6914)",
            boxShadow: `
              0 0 20px rgba(184, 134, 11, 0.4),
              0 0 40px rgba(184, 134, 11, 0.2),
              inset 0 0 60px rgba(218, 165, 32, 0.3)
            `,
          }}
        ></div>
        <LEDRing />
        <div
          className="absolute inset-4 rounded-full overflow-hidden shadow-lg"
          style={{
            border: "4px solid #DAA520",
            boxShadow: "0 0 15px rgba(218, 165, 32, 0.6)",
          }}
        >
          <Circle isSpinning={isSpinning} spinDegrees={spinDegrees} />
        </div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full z-20"
          style={{
            background: "linear-gradient(145deg, #DAA520, #B8860B)",
            boxShadow: "0 0 10px rgba(218, 165, 32, 0.5)",
          }}
        ></div>
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-3 rounded-full z-30 shadow-md transition-all duration-300 ease-in-out ${
            isSpinning
              ? "opacity-50 cursor-not-allowed"
              : "hover:brightness-110"
          }`}
          style={{
            background: "linear-gradient(145deg, #DAA520, #B8860B)",
            boxShadow: "0 0 15px rgba(218, 165, 32, 0.4)",
          }}
        >
          <Coins size={24} />
        </button>
        <PrizePin />
      </div>

      <AlertDialog open={showResult} onOpenChange={setShowResult}>
        <AlertDialogContent className="bg-gradient-to-b from-[#FFD700] to-[#FFA500] border-4 border-[#DAA520]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-center text-black">
              🎊 ยินดีด้วย! 🎊
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xl text-center text-black font-semibold">
              {winner}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-[#DAA520] hover:bg-[#B8860B] text-white font-bold"
              onClick={() => setShowResult(false)}
            >
              ปิด
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LuckyWheel;
