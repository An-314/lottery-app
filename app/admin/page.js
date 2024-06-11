'use client';

import { useEffect, useState } from 'react';

export default function Admin() {
    const [entries, setEntries] = useState([]);
    const [maxEntries, setMaxEntries] = useState(30);
    const [newMaxEntries, setNewMaxEntries] = useState('');

    useEffect(() => {
        fetchEntries();
        fetchMaxEntries();
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

    const fetchMaxEntries = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            setMaxEntries(data.maxEntries);
        } catch (error) {
            console.error('Error fetching max entries:', error);
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

    const handleMaxEntriesChange = (e) => {
        setNewMaxEntries(e.target.value);
    };

    const handleSetMaxEntries = async () => {
        if (newMaxEntries.trim() === '') return;

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ maxEntries: parseInt(newMaxEntries, 10) }),
            });
            if (res.ok) {
                const data = await res.json();
                setMaxEntries(parseInt(newMaxEntries, 10));
                alert('Max entries updated successfully');
            } else {
                const errorData = await res.json();
                alert(`Failed to update max entries: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Failed to update max entries:', error);
            alert('Failed to update max entries.');
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <button onClick={handleExport}>Export Data</button>
            <button onClick={handleClear}>Clear Data</button>
            <div>
                <h2>Set Max Entries</h2>
                <input
                    type="number"
                    placeholder="Enter max entries"
                    value={newMaxEntries}
                    onChange={handleMaxEntriesChange}
                />
                <button onClick={handleSetMaxEntries}>Set Max Entries</button>
                <p>Current Max Entries: {maxEntries}</p>
            </div>
            <ul>
                {entries.map((entry, index) => (
                    <li key={index}>{entry.userId} - {new Date(entry.timestamp).toLocaleString()}</li>
                ))}
            </ul>
        </div>
    );
}
