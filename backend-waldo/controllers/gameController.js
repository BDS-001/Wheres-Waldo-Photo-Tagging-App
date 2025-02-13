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
    const sessionId = req.sessionId
    const playerName = req.body.playerName
    const levelId = req.body.levelId

    let characters = await gameDb.getCharactersFromLevel(levelId)
    characters = characters.characters.map(char => ({
      ...char,
      found: false
    }));
    activeGames.set(sessionId, game(playerName, characters ))
    res.json({ message: 'Game started', playerName, characters });
}

function heartbeat(req, res) {
    const sessionId = req.sessionId
    const game = activeGames.get(sessionId)

    if (!game || game.complete) {
        return res.status(400).json({ error: 'No active game found' });
    }
    game.updateLastActivity()
    res.json({ message: 'Heartbeat received' });
}

function endGame(req, res) {
    const sessionId = req.sessionId
    const game = activeGames.get(sessionId)
    if (!game || game.complete) {
        return res.status(400).json({ error: 'No active game found' });
    }
    game.endGame()
    //TODO: add game data to database
    res.json({ message: 'Game complete', finalTime: game.finalTime });
    activeGames.delete(sessionId)
}

async function makeGuess(req, res) {
    const MIN_ACCURACY = 70
    const levelId = req.body.levelId
    if (!levelId) res.status(400).json({ error: 'invalid level id' });
    const characterId = req.body.levelId
    if (!characterId) res.status(400).json({ error: 'invalid character id' });

    const selectionData = req.body.selection
    const characterLocation = await gameDb.getCharacterLocation(characterId, levelId)
    const overlapPrecentage = calculateOverlap(selectionData, characterLocation)
    res.json({result: overlapPrecentage >= MIN_ACCURACY ? 'success' : 'fail'})
}

async function getLevels(req,res) {
    const levels = await gameDb.getAllLevels()
    res.json({levels});
}

module.exports = {
    startGame,
    heartbeat,
    endGame,
    makeGuess,
    getLevels
}