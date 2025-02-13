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

async function getCharactersFromLevel(levelId) {
    return await prisma.Level.findUnique({
      where: {
        id: levelId
      },
      select: {
        characters: {
          select: {
            x: true,
            y: true,
            width: true,
            height: true,
            character: true
          }
        }
      }
    })
  }

async function getAllLevels() {
    return await prisma.Level.findMany()
}

module.exports = {
    getCharacterLocation,
    addLeaderboardEntry,
    getCharactersFromLevel,
    getAllLevels
}