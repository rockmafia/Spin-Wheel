import { useState, useCallback, useRef } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Coins } from 'lucide-react';
import Incos from "../src/assets/In-cos.jpg"


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
              backgroundColor: [
                
              ][Math.floor(Math.random() * 5)],
              // backgroundColor: [
              //   "#ff0000",
              //   "#00ff00",
              //   "#0000ff",
              //   "#ffff00",
              //   "#ff00ff",
              // ][Math.floor(Math.random() * 5)]
            }}
          > <svg
          xmlns="http://www.w3.org/2000/svg"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
          image-rendering="optimizeQuality"
          fill-rule="evenodd"
          clip-rule="evenodd"
          viewBox="0 0 512 511.995"
          style={{width:"24px"}}
        >
          <path
            fill="#ECCA43"
            fill-rule="nonzero"
            d="M256 0c70.685 0 134.689 28.659 181.015 74.984C483.341 121.306 512 185.311 512 256c0 70.684-28.659 134.689-74.985 181.015-46.326 46.322-110.33 74.98-181.015 74.98-70.685 0-134.689-28.658-181.015-74.98C28.659 390.689 0 326.684 0 256c0-70.689 28.659-134.694 74.985-181.016C121.307 28.659 185.311 0 256 0z"
          />
          <ellipse fill="#F7E259" cx="256" cy="255.998" rx="250.992" ry="250.991" />
          <path
            fill="#F8D548"
            d="M503.753 215.692A252.691 252.691 0 01506.989 256c0 138.614-112.371 250.988-250.989 250.988S5.007 394.614 5.007 256c0-21.858 2.801-43.056 8.051-63.271l246.435 183.476 244.26-160.513z"
          />
          <path
            fill="#D7925B"
            fill-rule="nonzero"
            d="M256 58.922c54.414 0 103.688 22.061 139.353 57.725 35.664 35.661 57.725 84.935 57.725 139.349 0 54.414-22.061 103.688-57.725 139.352-35.665 35.664-84.939 57.726-139.353 57.726-54.414 0-103.688-22.062-139.349-57.726-35.664-35.664-57.725-84.938-57.725-139.352s22.061-103.688 57.725-139.349C152.312 80.983 201.586 58.922 256 58.922z"
          />
          <circle fill="#EDA140" cx="256.001" cy="255.997" r="192.069" />
          <path
            fill="#C26A34"
            fill-rule="nonzero"
            d="M235.907 353.009c-2.782-.197-4.485-.479-6.531-.809l-11.454-1.643-7.07-1.186c-2.29-.407-4.58-.869-6.84-1.37a151.612 151.612 0 01-6.608-1.609l-2.692-.723V301.43l12.51 1.018 9.185.544 9.639.428 9.763.304 9.489.184 8.816.043c2.68 0 5.029-.094 7.037-.274 2.067-.184 3.925-.467 5.568-.839 1.494-.338 2.8-.783 3.908-1.318.95-.458 1.742-1.006 2.358-1.622a4.978 4.978 0 001.173-1.836c.296-.814.445-1.79.445-2.907v-2.923c0-2.333-.749-4.036-2.243-5.093a10.365 10.365 0 00-3.047-1.485c-1.117-.347-2.371-.514-3.749-.514h-12.909c-9.724 0-18.349-1.091-25.851-3.266-7.649-2.217-14.103-5.564-19.359-10.023-5.372-4.585-9.387-10.649-12.032-18.195-2.576-7.345-3.869-16.089-3.869-26.216v-8.038c0-9.377 1.434-17.633 4.289-24.76 2.906-7.246 7.28-13.285 13.106-18.096 4.22-3.475 8.209-6.321 12.947-8.547 4.001-1.879 8.487-3.287 14.021-4.211v-19.624h40.798v18.832c6.749.539 11.98 1.481 18.584 2.675l3.428.599c2.863.505 5.718 1.057 8.543 1.643 2.65.544 5.2 1.113 7.623 1.7l2.778.676v44.298l-3.938-.346a469.51 469.51 0 00-11.804-.882 676.586 676.586 0 00-13.247-.702 681.155 681.155 0 00-13.26-.453c-3.792-.09-7.807-.138-12.04-.138-2.225 0-4.288.078-6.172.227-1.973.154-3.77.381-5.371.672-1.451.261-2.744.664-3.848 1.182-.976.462-1.819 1.04-2.508 1.729-.578.578-1.032 1.322-1.331 2.2-.351 1.031-.531 2.29-.531 3.762v2.435c0 1.567.227 2.894.677 3.955a6.37 6.37 0 001.874 2.495c.89.724 2.089 1.289 3.574 1.683 1.661.436 3.694.663 6.082.663h16.076c5.906 0 11.385.578 16.414 1.716 5.085 1.156 9.673 2.902 13.747 5.222 8.18 4.661 14.347 11.008 18.482 19.025 2.037 3.946 3.578 8.188 4.601 12.707 1.019 4.498 1.536 9.224 1.536 14.159v8.037c0 7.931-.71 15.002-2.114 21.187-1.434 6.309-3.621 11.684-6.54 16.114-2.923 4.434-6.484 8.158-10.653 11.154-4.165 2.992-8.932 5.26-14.265 6.788l-1.366.381c-5.204 1.498-8.971 2.585-15.031 3.249v21.237h-40.798v-21.036z"
          />
          <path
            fill="#F3DC6B"
            fill-rule="nonzero"
            d="M229.696 346.797c-2.782-.197-4.486-.479-6.532-.808l-11.453-1.644-7.071-1.186a165.05 165.05 0 01-6.839-1.369 153.505 153.505 0 01-6.609-1.609l-2.692-.724v-44.239l12.511 1.019 9.185.544 9.638.428 9.763.303 9.489.184 8.817.043c2.679 0 5.029-.094 7.036-.273 2.067-.185 3.925-.467 5.569-.84 1.494-.338 2.799-.783 3.907-1.318.951-.458 1.742-1.006 2.359-1.622a4.968 4.968 0 001.172-1.836c.296-.813.446-1.789.446-2.906v-2.924c0-2.332-.75-4.036-2.243-5.093a10.407 10.407 0 00-3.048-1.485c-1.117-.346-2.371-.514-3.749-.514h-12.909c-9.724 0-18.348-1.091-25.851-3.265-7.649-2.217-14.103-5.564-19.359-10.024-5.371-4.584-9.386-10.649-12.031-18.195-2.577-7.344-3.869-16.088-3.869-26.215v-8.038c0-9.378 1.433-17.634 4.288-24.76 2.906-7.246 7.281-13.286 13.106-18.096 4.22-3.476 8.209-6.322 12.947-8.548 4.002-1.878 8.487-3.287 14.022-4.211v-19.624h40.797v18.832c6.75.539 11.98 1.481 18.584 2.675l3.429.599c2.863.505 5.718 1.057 8.543 1.644 2.649.544 5.2 1.113 7.622 1.699l2.778.676v44.299l-3.937-.347a474.705 474.705 0 00-11.805-.882c-4.31-.269-8.732-.509-13.247-.701-4.716-.202-9.155-.36-13.26-.454-3.792-.09-7.806-.137-12.039-.137-2.226 0-4.289.077-6.172.227a53.554 53.554 0 00-5.372.672c-1.451.261-2.743.663-3.847 1.181-.976.462-1.819 1.04-2.508 1.729-.578.578-1.032 1.323-1.332 2.2-.351 1.032-.53 2.29-.53 3.762v2.436c0 1.566.227 2.893.676 3.954a6.373 6.373 0 001.875 2.496c.89.723 2.088 1.288 3.574 1.682 1.66.436 3.693.663 6.082.663h16.075c5.907 0 11.385.578 16.414 1.717 5.085 1.155 9.673 2.901 13.748 5.221 8.179 4.661 14.347 11.009 18.481 19.025 2.037 3.946 3.578 8.188 4.601 12.707 1.019 4.499 1.537 9.224 1.537 14.159v8.038c0 7.931-.711 15.001-2.114 21.186-1.434 6.309-3.621 11.685-6.541 16.115-2.923 4.434-6.484 8.157-10.653 11.153-4.164 2.992-8.932 5.261-14.265 6.789l-1.365.381c-5.205 1.498-8.971 2.585-15.032 3.248v21.238h-40.797v-21.037z"
          />
        </svg></div>
        ))}
      </div>
    );
  };


export default function SpinningWheelGame() {
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const wheelRef = useRef(null);
  const [prizes, setPrizes] = useState([
    { option: 'บัตร Starbucks', count: 25, color: '#8df129' },
    { option: 'บัตร Starbucks', count: 10, color: '#30b3ff' },
    { option: 'Gift Voucher Central 500 บาท', count: 3, color: '#ffde46' },
    { option: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#fa30ac' },
    { option: 'บัตร Starbucks', count: 15, color: '#8df129' },
    { option: 'เสียใจด้วยค่ะ พบกันปีหน้านะคะ', count: Infinity, color: '#30b3ff' },
    { option: 'Gift Voucher 1000 บาท', count: 2, color: '#ffde46' },
    { option: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#fa30ac' }
  ]);
  const [spins, setSpins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [distributedPrizes, setDistributedPrizes] = useState({
    starbucks25: 0,
    starbucks10: 0,
    voucher500: 0,
    starbucks15: 0,
    voucher1000: 0
  });

  const selectPrize = useCallback(() => {
    if (spins < 50) {
      const remainingSpins = 50 - spins;
      const remainingPrizes = 25 - distributedPrizes.starbucks25;
      const probability = remainingPrizes / remainingSpins;
      
      if (remainingPrizes > 0 && Math.random() < probability) {
        return 0;
      }
      return [3, 5, 7][Math.floor(Math.random() * 3)];
    }
    
    if (spins < 150) {
      const remainingSpins = 150 - spins;
      const remainingPrizes = [
        { index: 1, remaining: 10 - distributedPrizes.starbucks10 },
        { index: 2, remaining: 3 - distributedPrizes.voucher500 },
        { index: 4, remaining: 15 - distributedPrizes.starbucks15 },
        { index: 6, remaining: 2 - distributedPrizes.voucher1000 }
      ].filter(prize => prize.remaining > 0);
      
      const totalRemainingPrizes = remainingPrizes.reduce((sum, prize) => sum + prize.remaining, 0);
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

    setSpinning(true);
    setSpins(prevSpins => prevSpins + 1);

    const spinDuration = 5000;
    const spinRotations = 5 + Math.random() * 5;
    const targetRotation = 360 * spinRotations + (360 / prizes.length) * (prizes.length - selectedIndex);
    
    wheelRef.current.style.transition = `transform ${spinDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;

    setPrizeIndex(selectedIndex);

    setTimeout(() => {
      setSpinning(false);
      setShowResult(true);
      if (prizes[selectedIndex].count !== Infinity) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        setPrizes(prevPrizes => 
          prevPrizes.map((prize, index) => 
            index === selectedIndex ? { ...prize, count: prize.count - 1 } : prize
          )
        );
        setDistributedPrizes(prev => {
          const newDistributed = { ...prev };
          switch (selectedIndex) {
            case 0: newDistributed.starbucks25++; break;
            case 1: newDistributed.starbucks10++; break;
            case 2: newDistributed.voucher500++; break;
            case 4: newDistributed.starbucks15++; break;
            case 6: newDistributed.voucher1000++; break;
          }
          return newDistributed;
        });
      }
      
      if (spins >= 149) {
        setGameOver(true);
      }
      
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = `rotate(${targetRotation % 360}deg)`;
    }, spinDuration);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
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
      <div className="text-center mb-4">
        <div>
          <img src={Incos} alt='In-cos 2024' style={{width:"400px",height:"100px"}} className='mb-4'/>
        </div>
        {/* <h1 className="text-3xl font-bold mb-2 font-mono" style={{
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
        }}>
          IN-COSMETICS ASIA 2024
        </h1> */}
        <h2 className="text-3xl   font-serif font-bold" style={{color:"#56AD36"}}>
           BJ Lucky Spin Wheel Game 
        </h2>
      </div>
      <div className="text-lg mb-4">จำนวนการหมุน: {spins}</div>
      <div className="mb-4 relative" style={{ width: '400px', height: '400px' }}>
        <svg width="400" height="400" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <filter id="goldEffect">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#FFF5CC" result="specOut">
                <fePointLight x="200" y="200" z="200" />
              </feSpecularLighting>
              <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
              <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
            </filter>
            <filter id="wheelGlow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor="#FFD700" floodOpacity="0.5" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="ledGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FFFF00" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFF00" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          <g>
            <circle cx="200" cy="200" r="195" fill="url(#goldGradient)" filter="url(#wheelGlow)" />
            
            {Array.from({ length: 30 }).map((_, index) => {
              const angle = (index / 30) * 2 * Math.PI;
              const x = 200 + 185 * Math.cos(angle);
              const y = 200 + 185 * Math.sin(angle);
              const isLargeLight = [1, 5, 10, 15, 20, 25, 30].includes(index + 1);
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
            
            <g ref={wheelRef} style={{ transformOrigin: 'center' }}>
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
                    <path d={`M200,200 L${x1},${y1} A175,175 0 0,1 ${x2},${y2} Z`} fill={prize.color} />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#FFFFFF"
                      fontSize="16"
                      fontWeight="bold"
                      transform={`rotate(${(index + 0.5) * 360 / prizes.length}, ${labelX}, ${labelY})`}
                    >
                      {prize.option.length > 15 ? prize.option.slice(0, 12) + '...' : prize.option}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>

          <g className="cursor-pointer" onClick={handleSpinClick} style={{ pointerEvents: gameOver || spinning ? 'none' : 'auto' }}>
            <circle cx="200" cy="200" r="40" fill="url(#goldGradient)" filter="url(#goldEffect)" />
            <circle cx="200" cy="200" r="35" fill="#FFFFFF" />
            <foreignObject x="170" y="170" width="60" height="60">
              <div className="h-full w-full flex items-center justify-center">
                <Coins 
                  className={`w-8 h-8 ${spinning ? 'animate-spin' : ''}`} 
                  color={gameOver ? '#666666' : '#FFD700'} 
                />
              </div>
            </foreignObject>
          </g>
          
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {prizes
          .filter((_, index) => ![3, 5, 7].includes(index))
          .map((prize, index) => (
            <div key={index} className="bg-white p-2 rounded shadow">
              <div>{index + 1}. {prize.option}</div>
              <div>เหลือ: {prize.count}</div>
            </div>
          ))}
      </div>
      <AlertDialog open={showResult} onOpenChange={setShowResult}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ผลรางวัล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณได้รับ: {prizes[prizeIndex].option}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowResult(false)}>ปิด</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}