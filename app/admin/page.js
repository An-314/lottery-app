'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
    const [entries, setEntries] = useState([]);
    const [limit, setLimit] = useState('');
    const [winnerIds, setWinnerIds] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            const response = await axios.get('/api/entries');
            setEntries(response.data.entries);
        };

        fetchEntries();
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
        setWinnerIds([]);
    };

    const handleLimitChange = async () => {
        try {
            const response = await axios.post('/api/entries/limit', { limit });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to set limit.');
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <h2>Winners</h2>
            <ul>
                {winnerIds.map((id, index) => (
                    <li key={index}>{id}</li>
                ))}
            </ul>
            <h2>All Entries</h2>
            <ul>
                {entries.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
            <button onClick={handleExport}>Export Entries</button>
            <button onClick={handleClear}>Clear Entries</button>
            <div>
                <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="Set Lottery Limit"
                />
                <button onClick={handleLimitChange}>Set Limit</button>
            </div>
        </div>
    );
}
