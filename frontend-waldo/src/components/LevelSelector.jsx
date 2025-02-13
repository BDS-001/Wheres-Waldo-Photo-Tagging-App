/* eslint-disable react/prop-types */
import LoadingScreen from './Loading';
import { useState, useEffect } from 'react';

const LevelSelector = ({ onLevelSelect }) => {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchLevels = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/v1/levels');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data)
          setLevels(data.levels);
          setError(null);
        } catch (err) {
          setError('Failed to fetch levels. Please try again later.');
          console.error('Error fetching levels:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchLevels();
    }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="level-list">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onLevelSelect(level)}
          className="level-button"
        >
          <h3>Level {level.levelNum}: {level.title}</h3>
          {level.difficulty && (
            <div className="difficulty-badge">
              {level.difficulty}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;