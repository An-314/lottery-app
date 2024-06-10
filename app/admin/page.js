'use client';

import { useEffect, useState } from 'react';

export default function Admin() {
    const [entries, setEntries] = useState({});

    useEffect(() => {
        fetch('/api/entries')
            .then((res) => res.json())
            .then((data) => setEntries(data));
    }, []);

    return (
        <div>
            <h1>Admin Panel</h1>
            <ul>
                {/* {Object.entries(entries).map(([userId, timestamp], index) => (
                    // <li key={index}>{userId} - {new Date(timestamp).toLocaleString()}</li>
                    <li key={index}>{userId}</li>
                ))} */}
                {
                    Object.keys(entries).map((userId) => (
                        <li key={userId}>{userId}</li>
                    ))
                }
            </ul>
        </div>
    );
}
