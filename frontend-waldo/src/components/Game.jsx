import { useRef } from 'react';
import gameImage from '../assets/waldogame.png';
import AreaSelect from './AreaSelect';
import { useImageTransform } from '../hooks/useImageTransform';
import { useImageInteraction } from '../hooks/useImageInteraction';
import GameControls from './GameControls';

function Game() {
    const gameAreaRef = useRef(null);
    const imgContainerRef = useRef(null);

    const { scale, updatePosition, zoomIn, zoomOut } = useImageTransform(gameAreaRef, imgContainerRef);
    const {
        select,
        handleMouseDown,
        handleMouseUp,
        handleMouseLeave,
        handleMouseMove
    } = useImageInteraction(updatePosition, scale);

    return (
        <>
            <GameControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
            <div className="img-container" ref={imgContainerRef}>
                <div className="img-wrapper">
                    <img 
                        ref={gameAreaRef}
                        src={gameImage}
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
}

export default Game;