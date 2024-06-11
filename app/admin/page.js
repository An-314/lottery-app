'use client';

import { useEffect, useState } from 'react';

export default function Admin() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const res = await fetch('/api/entries');
            const data = await res.json();
            setEntries(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(entries, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'entries.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClear = async () => {
        try {
            const res = await fetch('/api/entries', {
                method: 'DELETE',
            });
            if (res.ok) {
                setEntries([]);
                alert('All data deleted successfully');
            } else {
                const errorData = await res.json();
                alert(`Failed to delete data: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Failed to delete data:', error);
            alert('Failed to delete data.');
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <button onClick={handleExport}>Export Data</button>
            <button onClick={handleClear}>Clear Data</button>
            <ul>
                {entries.map((entry, index) => (
                    <li key={index}>{entry.userId} - {new Date(entry.timestamp).toLocaleString()}</li>
                ))}
            </ul>
        </div>
    );
}
