const prisma = require('../prismaClient')

async function getCharacterLocation(characterId, levelId) {
    return await prisma.CharacterLocation.findUnique({
        where: {
            characterId,
            levelId
        }
    })
}

module.exports = {
    getCharacterLocation
}