'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [id, setId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 前端验证ID格式
    const idPattern = /^20\d{8}$/;
    if (!idPattern.test(id)) {
      setMessage('Invalid ID format. Please enter an ID in the format 20XXXXXXXX.');
      return;
    }

    try {
      const response = await axios.post('/api/entries', { id });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting your entry.');
    }
  };

  return (
    <div>
      <h1>Lottery System</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter your ID"
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
