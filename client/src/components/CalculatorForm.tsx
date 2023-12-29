import React, { useState } from 'react';
import axios from 'axios';

const CalculatorForm = () => {
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await axios.post('http://localhost:3000/api/add', { x, y });
    alert(`The sum is ${response.data.sum}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" value={x} onChange={e => setX(e.target.value)} />
      <input type="number" value={y} onChange={e => setY(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
};

export default CalculatorForm;