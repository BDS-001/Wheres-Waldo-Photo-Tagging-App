const express = require('express')
const router  = express.Router()
const gameController =  require('../controllers/gameController')
const { validationResults } = require('../validators');

// Get all available levels
router.get('/levels', gameController.getLevels);

// Get leaderboard for a specific level
router.get('/leaderboard/:levelId', gameController.getLeaderboard);

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

// Resume an existing game
router.get('/resume', gameController.resumeGame);

module.exports = router;