const prisma = require('../prismaClient')

async function getCharacterLocation(characterId, levelId) {
    return await prisma.CharacterLocation.findUnique({
        where: {
            levelId_characterId: {
                characterId,
                levelId
            }
        },
        include: {
            character: true,
            level: true
        }
    })
}

async function addLeaderboardEntry({playerName, levelId, timeSeconds}) {
    return await prisma.LeaderboardEntry.create({
        data: {
            playerName,
            levelId,
            timeSeconds
        }
    })
}

module.exports = {
    getCharacterLocation,
    addLeaderboardEntry
}