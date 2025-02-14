/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import LoadingScreen from './Loading';

const Leaderboard = ({ levelId }) => {
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

  if (leaderboard.length === 0) {
    return <div className="no-scores">No scores yet. Be the first!</div>;
  }

  return (
    <div className="leaderboard">
      <h3>Top Scores</h3>
      <div className="scores-list">
        {leaderboard.map((entry, index) => (
          <div key={entry.id} className="score-entry">
            <span className="rank">{index + 1}.</span>
            <span className="player-name">{entry.playerName}</span>
            <span className="time">{formatTime(entry.timeSeconds)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;