const gameDb = require('../prisma/queries/gameQueries')
const {calculateOverlap} = require('../utils/areaCalculations')
const activeGames = new Map()

const game = (playerSelectedName, characters) => {
    const startTime = Date.now()
    const playerName = playerSelectedName
    const characters = characters
    let lastActivity = startTime
    let complete = false
    let finalTime = null

    const updateLastActivity = () => {
        lastActivity = Date.now()
    }

    const endGame = () => {
        complete = true
        finalTime = Date.now() - startTime
    }

    return {
        get startTime() {return startTime},
        get playerName() {return playerName},
        get lastActivity() {return lastActivity},
        get complete() {return complete},
        get finalTime() {return finalTime},
        updateLastActivity,
        endGame
    }
}

//check every 5 minutes, max inactive time is 10 min
const activeGameCheck = 1000 * 60 * 5
const maxInactivity = 1000 * 60 * 10
setInterval(() => {
    const now = Date.now()
    for (const [sessionId, game] of activeGames.entries()) {
        if (now - game.lastActivity > maxInactivity) activeGames.delete(sessionId)
    }
}, activeGameCheck)

async function startGame(req, res) {
    try {
      const { sessionId } = req
      const { playerName, levelId } = req.body
  
      let characters = await gameDb.getCharactersFromLevel(levelId)
      if (!characters) {
        return res.status(404).json({ error: 'Level not found' })
      }
  
      characters = characters.characters.map(char => ({
        ...char,
        found: false
      }))
  
      activeGames.set(sessionId, game(playerName, characters))
      res.json({ message: 'Game started', playerName, characters })
    } catch (error) {
      console.error('Error starting game:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  function heartbeat(req, res) {
    try {
      const { sessionId } = req
      const game = activeGames.get(sessionId)
      
      if (!game || game.complete) {
        return res.status(404).json({ error: 'No active game found' })
      }
  
      game.updateLastActivity()
      res.json({ message: 'Heartbeat received' })
    } catch (error) {
      console.error('Error processing heartbeat:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }


  function endGame(req, res) {
    try {
      const { sessionId } = req
      const game = activeGames.get(sessionId)
      
      if (!game || game.complete) {
        return res.status(404).json({ error: 'No active game found' })
      }
  
      game.endGame()
      const finalTime = game.finalTime
      activeGames.delete(sessionId)
      res.json({ message: 'Game complete', finalTime })
    } catch (error) {
      console.error('Error ending game:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async function makeGuess(req, res) {
    try {
      const MIN_ACCURACY = 70
      const { levelId, characterId, selection: selectionData } = req.body
  
      const characterLocation = await gameDb.getCharacterLocation(characterId, levelId)
      if (!characterLocation) {
        return res.status(404).json({ error: 'Character location not found' })
      }
  
      const overlapPercentage = calculateOverlap(selectionData, characterLocation)
      res.json({ result: overlapPercentage >= MIN_ACCURACY ? 'success' : 'fail' })
    } catch (error) {
      console.error('Error processing guess:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async function getLevels(req, res) {
    try {
      const levels = await gameDb.getAllLevels()
      if (!levels) {
        return res.status(404).json({ error: 'No levels found' })
      }
      res.json({ levels })
    } catch (error) {
      console.error('Error fetching levels:', error)
      res.status(500).json({ error: 'Failed to fetch levels' })
    }
  }

module.exports = {
    startGame,
    heartbeat,
    endGame,
    makeGuess,
    getLevels
}