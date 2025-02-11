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

module.exports = {
    getCharacterLocation
}