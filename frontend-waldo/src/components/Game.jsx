import { useRef, useState } from 'react';
import AreaSelect from './AreaSelect';
import { useImageTransform } from '../hooks/useImageTransform';
import { useImageInteraction } from '../hooks/useImageInteraction';
import GameControls from './GameControls';
import LoadingScreen from './Loading';
import NameEntry from './NameEntry';
import LevelSelector from './LevelSelector';
import Leaderboard from './Leaderboard';
import { startGame } from '../services/gameService';
import { useHeartbeat } from '../hooks/useHeartbeat';
import CharacterGuess from './CharacterGuess';

function Game() {
    const gameAreaRef = useRef(null);
    const imgContainerRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const [playerName, setPlayerName] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [gameState, setGameState] = useState('name-entry');
    const [error, setError] = useState(null);
    const [foundCharacters, setFoundCharacters] = useState([]);
    const [characters, setCharacters] = useState([]);
    useHeartbeat(gameState === 'playing')

    const { 
        scale, 
        translateX, 
        translateY, 
        updatePosition, 
        zoomIn, 
        zoomOut,
        setGameStarted,
        gameStarted
    } = useImageTransform(gameAreaRef, imgContainerRef);

    const {
        select,
        setSelect,
        handleMouseDown,
        handleMouseUp,
        handleMouseLeave,
        handleMouseMove
    } = useImageInteraction(updatePosition, scale, translateX, translateY, gameAreaRef,imgContainerRef);

    const handleNameSubmit = (name) => {
        setPlayerName(name);
        setGameState('selecting');
    };

    const handleLevelSelect = async (level) => {
        try {
            setLoading(true);
            setSelectedLevel(level);
            const gameSession = await startGame(playerName, level.id);
            
            if (gameSession.characters) {
                const charactersList = gameSession.characters.map(char => ({
                    id: char.character.id,
                    name: char.character.name,
                    location: {
                        x: char.x,
                        y: char.y,
                        width: char.width,
                        height: char.height
                    }
                }));
                setCharacters(charactersList);
            } else {
                console.error('No characters received from game session');
                setError('Failed to load characters for this level');
            }
            
            setGameState('playing');
            setError(null);
        } catch (err) {
            console.error('Error starting game:', err);
            setError('Failed to start game. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGuessComplete = (characterId) => {
        setFoundCharacters(prev => [...prev, characterId]);
        
        // Check if all characters are found
        if (foundCharacters.length + 1 === characters.length) {
            setGameState('finished');
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={() => setGameState('name-entry')}>Start Over</button>
            </div>
        );
    }

    if (playerName && selectedLevel && !gameStarted) setGameStarted(true)

    // Render different components based on game state
    switch (gameState) {
        case 'name-entry':
            return <NameEntry onNameSubmit={handleNameSubmit} />;
            
        case 'selecting':
            return <LevelSelector onLevelSelect={handleLevelSelect} />;
            
        case 'playing':
            return (
                <>
                    <GameControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
                    <CharacterGuess
                        levelId={selectedLevel.id}
                        selectedPosition={select}
                        onGuessSubmit={() => setSelect(prev => ({ ...prev, display: 'none' }))}
                        foundCharacters={foundCharacters}
                        characters={characters}
                        onGuessComplete={handleGuessComplete}
                    />
                    <div className="img-container" ref={imgContainerRef}>
                        <div className="img-wrapper">
                            <img 
                                ref={gameAreaRef}
                                src={selectedLevel.imageUrl}
                                alt="waldo game"
                                className="game-img"
                                draggable={false}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                                onMouseMove={handleMouseMove}
                            />
                            <AreaSelect position={select} />
                        </div>
                    </div>
                </>
            );
            
        case 'finished':
            setGameStarted(false)
            return (
                <div className="game-finished">
                    <h2>Game Complete!</h2>
                        <div className="final-time">
                            TODO: Your Time: {(10.2324).toFixed(1)} seconds
                        </div>
                    <div className="leaderboard-container">
                        <Leaderboard levelId={selectedLevel?.id} />
                    </div>
                    <button 
                        className="play-again-btn"
                        onClick={() => setGameState('name-entry')}
                    >
                        Play Again
                    </button>
                </div>
            );
            
        default:
            return <div>Unknown game state</div>;
    }
}

export default Game;