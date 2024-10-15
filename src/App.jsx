import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import Modal from "react-modal";

const App = () => {
  const [prizes, setPrizes] = useState([
    { option: 'ถูกรางวัลที่ 1' },
    { option: 'ไม่ถูกรางวัล' },
    { option: 'ถูกรางวัลที่ 2' },
    { option: 'ไม่ถูกรางวัล' },
    { option: 'ถูกรางวัลที่ 3' },
    { option: 'ไม่ถูกรางวัล' },
  ]);

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState("");
  const [winCount, setWinCount] = useState(0); // จำนวนรางวัลที่ถูกรางวัลแล้ว
  const totalWins = 5; // รางวัลทั้งหมดที่ต้องการแจกคือ 5 รางวัล
  const [startTime, setStartTime] = useState(null); // เวลาเริ่มต้นของการหมุนรางวัล

  // ฟังก์ชันเริ่มการหมุน
  const handleSpinClick = () => {
    // ถ้ายังไม่ครบ 5 รางวัลและยังอยู่ในเวลา 5 นาที
    if (winCount < totalWins && (startTime === null || Date.now() - startTime <= 5 * 60 * 1000)) {
      const newPrizeNumber = Math.floor(Math.random() * prizes.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);

      // เริ่มจับเวลาเมื่อหมุนครั้งแรก
      if (startTime === null) {
        setStartTime(Date.now());
      }
    } else {
      alert('หมดเวลาแล้ว หรือคุณถูกรางวัลครบแล้ว');
    }
  };

  // ฟังก์ชันจัดการเมื่อวงล้อหยุดหมุน
  const handleStopSpinning = () => {
    setMustSpin(false);
    const prize = prizes[prizeNumber].option;

    // ถูกรางวัลเพิ่มขึ้นหากไม่ใช่ 'ไม่ถูกรางวัล'
    if (prize !== 'ไม่ถูกรางวัล') {
      setWinCount(prevCount => prevCount + 1);
    }

    setSelectedPrize(prize);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <h1>วงล้อรางวัล</h1>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={prizes}
        onStopSpinning={handleStopSpinning}
        backgroundColors={['#3e3e3e', '#df3428', '#4BC0C0', '#FFCE56']}
        textColors={['#ffffff']}
      />
      <button onClick={handleSpinClick} disabled={mustSpin || winCount >= totalWins}>
        หมุนวงล้อ
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="ผลลัพธ์จากการหมุน"
      >
        <h2>คุณได้: {selectedPrize}</h2>
        <button onClick={handleCloseModal}>ปิด</button>
      </Modal>
      <div>รางวัลที่ถูกรางวัลไปแล้ว: {winCount}/{totalWins}</div>
    </div>
  );
};

export default App;
