/* eslint-disable react/prop-types */
import { useState } from 'react';

const NameEntry = ({ onNameSubmit }) => {
  const [playerName, setPlayerName] = useState('');
  const maxLength = 20;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim().length > 0) {
      onNameSubmit(playerName);
      console.log('submitted player name', playerName)
    }
  };

  const handleKeyInput = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setPlayerName(value);
      console.log('updated value', value)
    }
    console.log('keypress detected')
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
          disabled={playerName.trim().length === 0}
        >
          Start Game
        </button>
      </form>
      <p>Enter a username</p>
    </div>
  );
};

export default NameEntry;