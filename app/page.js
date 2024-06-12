'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

export default function Home() {
  const [id, setId] = useState('');
  const [message, setMessage] = useState('');
  const [prizeName, setPrizeName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [showWatermark, setShowWatermark] = useState(false);
  const captureRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRotated(true);

    try {
      const response = await axios.post('/api/entries', { id });
      setMessage(response.data.message);
      setPrizeName(response.data.prizeName);
    } catch (error) {
      setMessage('Error submitting your entry.');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // 动画持续时间
    }
  };

  const handleReturn = () => {
    setIsRotated(false);
  };

  const handleCapture = async () => {
    setShowWatermark(true);
    await new Promise((resolve) => setTimeout(resolve, 100)); // 等待水印渲染
    if (captureRef.current) {
      const canvas = await html2canvas(document.body);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'voucher.png';
      link.click();
    }
    setShowWatermark(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        className="relative w-64 h-96 bg-red-500 rounded-lg shadow-md flex items-center justify-center"
        animate={{ rotateY: isRotated ? 180 : 0 }}
        transition={{ duration: 1 }}
        ref={captureRef}
      >
        <AnimatePresence>
          {!isRotated && !isLoading ? (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-2xl font-bold mb-4 text-center text-white">Lottery System</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter your ID"
                  className="w-full p-2 border border-gray-300 rounded bg-darkred-700 text-darkyellow-500"
                  required
                />
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold ${isLoading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-700'}`}
                    disabled={isLoading}
                  >
                    {isLoading ? '...' : '🎁'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : null}
          {isRotated && !isLoading && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-center text-lg text-white" style={{ transform: 'rotateY(180deg)' }}>{message}</p>
              <p className="text-center text-lg text-white mt-2" style={{ transform: 'rotateY(180deg)' }}>Prize: {prizeName}</p>
              {showWatermark && (
                <p className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-50" style={{ transform: 'rotateY(180deg)' }}>
                  兑换奖品凭证
                </p>
              )}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleReturn}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold"
                >
                  🔄
                </button>
                <button
                  onClick={handleCapture}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold"
                >
                  📸
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
