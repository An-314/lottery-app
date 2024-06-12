'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

export default function Admin() {
    const [entries, setEntries] = useState([]);
    const [limit, setLimit] = useState('');
    const [currentLimit, setCurrentLimit] = useState('');
    const [prizeName, setPrizeName] = useState('');
    const [currentPrizeName, setCurrentPrizeName] = useState('');
    const [message, setMessage] = useState('');
    const captureRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const entriesResponse = await axios.get('/api/entries');
            const limitResponse = await axios.get('/api/limit');
            const prizeResponse = await axios.get('/api/prize');
            setEntries(entriesResponse.data.entries);
            setCurrentLimit(limitResponse.data.limit);
            setCurrentPrizeName(prizeResponse.data.prizeName);
        };

        fetchData();
    }, []);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "entries.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleClear = async () => {
        await axios.delete('/api/entries');
        setEntries([]);
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

    const handleCapture = async () => {
        if (captureRef.current) {
            const canvas = await html2canvas(document.body);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'admin-view.png';
            link.click();
        }
    };

    return (
        <div className="flex items-start justify-center min-h-screen bg-gray-100 p-4 space-x-4">
            <div className="w-1/4 bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Winners</h2>
                <ul className="space-y-2">
                    {entries.map((entry, index) => (
                        <li key={index} className="bg-gray-200 p-2 rounded">{entry}</li>
                    ))}
                </ul>
                <button onClick={handleExport} className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Export Entries</button>
                <button onClick={handleClear} className="mt-2 w-full py-2 bg-red-500 text-white rounded hover:bg-red-700">Clear Entries</button>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center bg-white p-4 rounded shadow-md space-y-4">
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <img src="/path/to/your/logo.png" alt="Event Logo" className="w-1/2" />
                <div className="w-full">
                    <label className="block text-gray-700">Current Limit: {currentLimit}</label>
                    <input
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        placeholder="Set Lottery Limit"
                        className="w-full p-2 border border-gray-300 rounded bg-darkred-700 text-darkyellow-500"
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
                        className="w-full p-2 border border-gray-300 rounded bg-darkred-700 text-darkyellow-500"
                    />
                    <button onClick={handlePrizeChange} className="mt-2 w-full py-2 bg-green-500 text-white rounded hover:bg-green-700">Set Prize</button>
                </div>
                <button onClick={handleCapture} className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Capture View</button>
                {message && <p className="text-center text-lg">{message}</p>}
            </div>
        </div>
    );
}
