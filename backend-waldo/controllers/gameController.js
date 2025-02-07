const activeGames = new Map()

const game = (playerSelectedName) => {
    const startTime = Date.now()
    const playerName = playerSelectedName
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

function startGame(req, res) {
    const sessionId = req.sessionId
    const playerName = req.body.playerName
    activeGames.set(sessionId, game(playerName))
    res.json({ message: 'Game started' });
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

module.exports = {
    startGame,
    heartbeat,
    endGame
}