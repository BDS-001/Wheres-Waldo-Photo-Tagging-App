/* eslint-disable react/prop-types */
import { useState } from 'react';

const NameEntry = ({ onNameSubmit }) => {
  const [playerName, setPlayerName] = useState('');
  const maxLength = 20;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.length === maxLength) {
      onNameSubmit(playerName.toUpperCase());
    }
  };

  const handleKeyInput = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setPlayerName(value);
    }
  };

  return (
    <div className="name-entry">
      <h1>Enter Your Username</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={playerName}
          onChange={handleKeyInput}
          placeholder="AAA"
          maxLength={maxLength}
        />
        <button
          type="submit"
          disabled={playerName.length !== maxLength}
        >
          Start Game
        </button>
      </form>
      <p>Enter a username</p>
    </div>
  );
};

export default NameEntry;