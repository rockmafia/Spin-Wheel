import { useState, useCallback, useRef } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Coins } from 'lucide-react';

export default function SpinningWheelGame() {
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const wheelRef = useRef(null);
  const [prizes, setPrizes] = useState([
    { option: 'บัตร Starbucks', count: 25, color: '#af12a1' },
    { option: 'บัตร Starbucks', count: 10, color: '#FFFFFF' },
    { option: 'Gift Voucher Central 500 บาท', count: 3, color: '#af12a1' },
    { option: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#FFFFFF' },
    { option: 'บัตร Starbucks', count: 15, color: '#af12a1' },
    { option: 'เสียใจด้วยค่ะ พบกันปีหน้านะคะ', count: Infinity, color: '#FFFFFF' },
    { option: 'Gift Voucher 1000 บาท', count: 2, color: '#af12a1' },
    { option: 'เสียใจด้วยคุณไม่ได้รับรางวัล', count: Infinity, color: '#FFFFFF' }
  ]);
  const [spins, setSpins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
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
      const remainingPrizes = [
        { index: 0, remaining: 25 - distributedPrizes.starbucks25 },
        { index: 2, remaining: 1 - (distributedPrizes.voucher500 > 0 ? 1 : 0) },
        { index: 6, remaining: 1 - (distributedPrizes.voucher1000 > 0 ? 1 : 0) }
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
    
    if (spins < 150) {
      const remainingSpins = 150 - spins;
      const remainingPrizes = [
        { index: 1, remaining: 10 - distributedPrizes.starbucks10 },
        { index: 2, remaining: 2 - Math.max(0, distributedPrizes.voucher500 - 1) },
        { index: 4, remaining: 15 - distributedPrizes.starbucks15 },
        { index: 6, remaining: 1 - Math.max(0, distributedPrizes.voucher1000 - 1) }
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
    <div className="flex flex-col items-center justify-center min-h-screen  p-4" 
    style={{
      backgroundImage: `url(/BjpinwheelVerone.jpg)`,
      backgroundSize: "auto",
    }}>
      <div className="text-lg mt-[40rem] text-black">จำนวนการหมุน: {spins}</div>
      <div className=" relative" style={{ width: '800px', height: '800px' }}>
        <svg width="800" height="800" viewBox="0 0 400 400">
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
                      fill={index % 2 === 0 ? '#FFFFFF' : '#af12a1'}
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
            <circle cx="200" cy="200" r="35" fill="url(#goldGradient)" filter="url(#goldEffect)" />
            <foreignObject x="170" y="170" width="60" height="60">
              <div className="h-full w-full flex items-center justify-center">
                <Coins 
                  className={`w-8 h-8 ${spinning ? 'animate-spin' : ''}`} 
                  color={gameOver ? '#666666' : '#FFD700'} 
                />
              </div>
            </foreignObject>
          </g>
          
          <polygon 
            points="380,200 395,190 395,210" 
            fill="url(#goldGradient)" 
            filter="url(#goldEffect)"
            transform="rotate(90, 390, 200)" 
          />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-[50rem]">
        {prizes
          .filter((_, index) => ![3, 5, 7].includes(index))
          .map((prize, index) => (
            <div key={index} className="bg-white p-2 rounded shadow text-black">
              <div>{index + 1}. {prize.option}</div>
              <div>: {prize.count} รางวัล</div>
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