/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import gameImage from './assets/testImage.png'

function Game() {
    const gameAreaRef = useRef(null)
    const [scale, setScale] = useState(1)
    const [translateX, setTranslateX] = useState(0)
    const [translateY, setTranslateY] = useState(0)
    const SCALE_VAL = 0.2
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 4;

    useEffect(() => {
        const img = gameAreaRef.current
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
    }, [scale, translateX, translateY])

    const getCoordinates = (e) => {
        const img = gameAreaRef.current;
        const rect = img.getBoundingClientRect()

        const scaleX = img.naturalWidth / rect.width;
        const scaleY = img.naturalHeight / rect.height;
        
        // Get the click position relative to the canvas and adjust for scaling
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        console.log(`Click coordinates: \nX: ${x} \nY: ${y}`);
        return [x, y]
    }

    const zoomIn = (e) => {
        if (scale < MAX_SCALE) {
            setScale(scale + SCALE_VAL)
        }
    }

    const zoomOut = (e) => {
        if (scale > MIN_SCALE) {
            setScale(scale - SCALE_VAL)
        }
    }

    const moveLeft = (e) => {
        setTranslateX(translateX + 10)
    }

    const moveRight = (e) => {
        setTranslateX(translateX - 10)
    }

    const moveUp = (e) => {
        setTranslateY(translateY + 10)
    }

    const moveDown = (e) => {
        setTranslateY(translateY - 10)
    }


    return (
        <>
        <button onClick={moveLeft}>{'<= LEFT'}</button>
        <button onClick={zoomIn}>zoom in</button>
        <button onClick={moveUp}>{'^ UP'}</button>
        <button onClick={moveDown}>{'DOWN v'}</button>
        <button onClick={zoomOut}>zoom out</button>
        <button onClick={moveRight}>{'RIGHT =>'}</button>
        <div className="img-container">
            <div className="img-wrapper">
                <img ref={gameAreaRef} src={gameImage} alt="waldo game" className='game-img' onClick={getCoordinates} />
            </div>
        </div>
        </>
    )
}

export default Game