/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import LoadingScreen from './Loading';

const Leaderboard = ({ levelId, onPlayAgain, finalTime }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!levelId) return;

      try {
        const response = await fetch(`http://localhost:3000/api/v1/leaderboard/${levelId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLeaderboard(data.leaderboard);
        setError(null);
      } catch (err) {
        setError('Failed to fetch leaderboard');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [levelId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    return `${minutes}:${remainingSeconds.padStart(4, '0')}`;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="game-finished">
      <h2>Game Complete!</h2>
      {finalTime && (
        <div className="final-time">
          Your Time: {formatTime(finalTime / 1000)} seconds
        </div>
      )}
      
      <div className="leaderboard">
        <h3>Top Scores</h3>
        {leaderboard.length === 0 ? (
          <div className="no-scores">No scores yet. Be the first!</div>
        ) : (
          <div className="scores-list">
            {leaderboard.map((entry, index) => (
              <div key={entry.id} className="score-entry">
                <span className="rank">{index + 1}.</span>
                <span className="player-name">{entry.playerName}</span>
                <span className="time">{formatTime(entry.timeSeconds)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        className="play-again-btn"
        onClick={onPlayAgain}
      >
        Play Again
      </button>
    </div>
  );
};

export default Leaderboard;