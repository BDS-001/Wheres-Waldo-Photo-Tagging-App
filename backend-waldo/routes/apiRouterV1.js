const express = require('express')
const router  = express.Router()
const gameController =  require('../controllers/gameController')

router.post('/start', gameController.startGame)

module.exports = router