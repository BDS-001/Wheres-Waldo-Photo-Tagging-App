const express = require('express')
const router  = express.Router()
const gameController =  require('../controllers/gameController')
const { validationResults } = require('../validators');

// Get all available levels
router.get('/levels', gameController.getLevels);

// Start a new game
router.post('/start', 
  validationResults('gameStart'),
  gameController.startGame
);

// Keep game session alive
router.post('/heartbeat', gameController.heartbeat);

// Submit a guess for character location
router.post('/guess',
  validationResults('guess'),
  gameController.makeGuess
);

// Submit a leaderboard entry (typically handled automatically by the game)
router.post('/leaderboard',
  validationResults('leaderboard'),
  gameController.addLeaderboardEntry
);

module.exports = router;