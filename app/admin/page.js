'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { parse } from 'json2csv';

export default function Admin() {
    const [dataset, setDataset] = useState([]);
    const [limit, setLimit] = useState('');
    const [currentLimit, setCurrentLimit] = useState('');
    const [currentPrizeName, setCurrentPrizeName] = useState('');
    const [prizeName, setPrizeName] = useState('');
    const [message, setMessage] = useState('');
    const [winners, setWinners] = useState([]);
    const [selectedPrize, setSelectedPrize] = useState('');
    const [filteredWinners, setFilteredWinners] = useState([]);
    const captureRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const datasetResponse = await axios.get('/api/entries');
            const limitResponse = await axios.get('/api/limit');
            const prizeResponse = await axios.get('/api/prize');
            const winnersResponse = await axios.get('/api/winners');
            setDataset(datasetResponse.data.dataset || []);
            setCurrentLimit(limitResponse.data.limit);
            setCurrentPrizeName(prizeResponse.data.prizeName);
            setWinners(winnersResponse.data.winners || []);
        };

        fetchData();
    }, []);

    const fetchWinners = async () => {
        const winnersResponse = await axios.get('/api/winners');
        setWinners(winnersResponse.data.winners || []);
        setFilteredWinners(winnersResponse.data.winners || []);
    };

    const handleExport = () => {
        const fields = ['ID'];
        const csv = parse(dataset.map(entry => ({ ID: entry })), { fields });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${currentPrizeName}.csv`);
    };

    const handleClear = async () => {
        await axios.delete('/api/entries');
        setDataset([]);
        setWinners([]);
    };

    const handleLimitChange = async () => {
        try {
            const response = await axios.post('/api/limit', { limit });
            setCurrentLimit(limit);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to set limit.');
        }
    };

    const handlePrizeChange = async () => {
        try {
            const response = await axios.post('/api/prize', { prizeName });
            setCurrentPrizeName(prizeName);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to set prize name.');
        }
    };

    const handleLottery = async () => {
        try {
            const response = await axios.post('/api/lottery');
            setMessage(response.data.message);
            await fetchWinners(); // 抽奖后获取最新的获奖者信息
        } catch (error) {
            setMessage('Failed to run lottery.');
        }
    };

    const handleCapture = async () => {
        if (captureRef.current) {
            const canvas = await html2canvas(document.body);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'admin-view.png';
            link.click();
        }
    };

    const handleFilterChange = (e) => {
        setSelectedPrize(e.target.value);
        if (e.target.value) {
            const filtered = winners.filter(winner => winner.prize_name === e.target.value);
            setFilteredWinners(filtered);
        } else {
            setFilteredWinners(winners);
        }
    };

    const handleExportWinners = () => {
        const fields = ['ID', 'Prize'];
        const csv = parse((filteredWinners.length > 0 ? filteredWinners : winners).map(winner => ({ ID: winner.student_id, Prize: winner.prize_name })), { fields });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `Winners_${selectedPrize || 'all'}.csv`);
    };

    const handleClearWinners = async () => {
        await axios.delete('/api/winners');
        setWinners([]);
        setFilteredWinners([]);
    };

    return (
        <div className="flex items-start justify-center min-h-screen bg-gray-100 p-4 space-x-4">
            <div className="w-1/4 bg-white p-4 rounded shadow-md">
                <h2 className="text-xl text-black font-bold mb-4">All Entries</h2>
                <ul className="space-y-2">
                    {dataset.map((entry, index) => (
                        <li key={index} className="bg-gray-200 text-black p-2 rounded">{entry}</li>
                    ))}
                </ul>
                <button onClick={handleExport} className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Export Entries</button>
                <button onClick={handleClear} className="mt-2 w-full py-2 bg-red-500 text-white rounded hover:bg-red-700">Clear Entries</button>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center bg-white p-4 rounded shadow-md space-y-4">
                <h2 className="text-xl text-black font-bold">Admin Panel</h2>
                <img src="/image/admin.png" alt="Event Logo" className="w-1/2" />
                <div className="w-full">
                    <label className="block text-gray-700">Current Limit: {currentLimit}</label>
                    <input
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        placeholder="Set Lottery Limit"
                        className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white-500"
                    />
                    <button onClick={handleLimitChange} className="mt-2 w-full py-2 bg-green-500 text-white rounded hover:bg-green-700">Set Limit</button>
                </div>
                <div className="w-full">
                    <label className="block text-gray-700">Current Prize: {currentPrizeName}</label>
                    <input
                        type="text"
                        value={prizeName}
                        onChange={(e) => setPrizeName(e.target.value)}
                        placeholder="Set Prize Name"
                        className="w-full p-2 border border-gray-300 rounded bg-gray-700 text-white-500"
                    />
                    <button onClick={handlePrizeChange} className="mt-2 w-full py-2 bg-green-500 text-white rounded hover:bg-green-700">Set Prize</button>
                </div>
                <button onClick={handleLottery} className="mt-4 w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Run Lottery</button>
                <button onClick={handleCapture} className="mt-4 w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Capture View</button>
                {message && <p className="text-center text-black text-lg">{message}</p>}
            </div>
            <div className="w-1/4 bg-white p-4 rounded shadow-md">
                <h2 className="text-xl text-black font-bold mb-4">Winners</h2>
                <select value={selectedPrize} onChange={handleFilterChange} className="w-full p-2 border text-black border-gray-300 rounded mb-4">
                    <option className="text-black" value="">All Prizes</option>
                    {[...new Set(winners.map(winner => winner.prize_name))].map((prize, index) => (
                        <option className="text-black" key={index} value={prize}>{prize}</option>
                    ))}
                </select>
                <ul className="space-y-2">
                    {(filteredWinners.length > 0 ? filteredWinners : winners).map((winner, index) => (
                        <li key={index} className="bg-gray-200 text-black p-2 rounded">ID: {winner.student_id}, 奖项: {winner.prize_name}</li>
                    ))}
                </ul>
                <button onClick={handleExportWinners} className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Export Winners</button>
                <button onClick={handleClearWinners} className="mt-2 w-full py-2 bg-red-500 text-white rounded hover:bg-red-700">Clear Winners</button>
            </div>
        </div>
    );
}
