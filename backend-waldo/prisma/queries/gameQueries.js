const prisma = require('../prismaClient')

function getCharacterLocation(characterId, levelId) {
    return prisma.CharacterLocation.findUnique({
        where: {
            characterId,
            levelId
        }
    })
}