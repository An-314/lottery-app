'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Lottery() {
    const [winners, setWinners] = useState([]);
    const [message, setMessage] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [rotatedIndexes, setRotatedIndexes] = useState([]);

    const handleLottery = async () => {
        try {
            const response = await axios.post('/api/lottery');
            setMessage(response.data.message);
            setWinners(response.data.winners);
            setShowResults(true);
            animateRotation(response.data.winners.length);
        } catch (error) {
            setMessage('Failed to run lottery.');
        }
    };

    const animateRotation = (count) => {
        setRotatedIndexes([]);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                setRotatedIndexes((prevIndexes) => [...prevIndexes, i]);
            }, i * 500); // Delay each rotation by 500ms
        }
    };

    const handleClear = () => {
        setWinners([]);
        setShowResults(false);
        setRotatedIndexes([]);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {showResults && (
                        <motion.div
                            className="flex flex-wrap justify-center"
                            initial={{ opacity: 0, x: '-100vw' }}
                            animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 50, staggerChildren: 0.2 } }}
                            exit={{ opacity: 0, x: '100vw', transition: { duration: 0.5 } }}
                        >
                            {winners.map((winner, index) => (
                                <motion.div
                                    key={index}
                                    className="relative w-64 h-40 bg-red-500 rounded-lg shadow-md flex items-center justify-center m-2 "
                                    initial={{ rotateY: 0 }}
                                    animate={{ rotateY: rotatedIndexes.includes(index) ? 180 : 0 }}
                                    style={{ perspective: 1000 }}
                                >
                                    {!rotatedIndexes.includes(index) ? (
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center bg-red-500 rounded-lg"
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <p className="text-3xl text-bold text-white">溯·洄</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-500 rounded-lg"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <p className="text-3xl text-white" style={{ transform: 'rotateY(180deg)' }} >{winner.student_id}</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-4">
                {!showResults && (<button
                    onClick={handleLottery}
                    className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
                >
                    Run Lottery
                </button>)}
                {showResults && (
                    <button
                        onClick={handleClear}
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        Clear Results
                    </button>
                )}
            </div>
        </div>
    );
}
