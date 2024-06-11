'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/entries')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userId.trim() === '') return;

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setData(updatedData);
        setStatus('Submitted successfully!');
      } else {
        const errorData = await response.json();
        setStatus(errorData.error);
      }
    } catch (error) {
      console.error('Failed to submit data:', error);
      setStatus('Failed to submit data.');
    }
  };

  return (
    <div>
      <h1>Lucky Draw</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {status && <p>{status}</p>}
      <ul>
        {data.map((entry, index) => (
          <li key={index}>{entry.userId} - {new Date(entry.timestamp).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
