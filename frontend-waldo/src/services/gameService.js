// src/services/gameService.js
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Start a new game session
export const startGame = async (playerName, levelId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName,
        levelId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
};

// Keep game session alive
export const heartbeat = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/heartbeat`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending heartbeat:', error);
    throw error;
  }
};

// Submit a guess for character location
export const submitGuess = async (levelId, x, y) => {
  try {
    const response = await fetch(`${API_BASE_URL}/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        levelId,
        x,
        y
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting guess:', error);
    throw error;
  }
};

// Get available levels
export const fetchLevels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/levels`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
};

// Get leaderboard for a specific level
export const fetchLeaderboard = async (levelId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/${levelId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

// Resume an existing game session
export const resumeGame = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/resume`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error resuming game:', error);
    throw error;
  }
};