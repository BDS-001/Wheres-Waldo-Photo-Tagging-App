/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import gameImage from './assets/testImage.png'
import AreaSelect from './AreaSelect'

function Game() {
    const gameAreaRef = useRef(null)
    const imgContainer = useRef(null)
    const isHoldingRef = useRef(false)
    const dragged = useRef(false)
    const draggableTimer = useRef(null)
    const [scale, setScale] = useState(1)
    const [translateX, setTranslateX] = useState(0)
    const [translateY, setTranslateY] = useState(0)
    const [select, setSelect] = useState({top: 0, left: 0, width: '50px', height:'50px', display: 'block'});
    const lastPositionRef = useRef({ x: 0, y: 0 })
    const SCALE_VAL = 0.1;
    const MIN_SCALE = 0.2;
    const MAX_SCALE = 4;

    useEffect(() => {
        const img = gameAreaRef.current
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
    }, [scale, translateX, translateY])

    const calculaterMinScale = () => {
        const img = gameAreaRef.current;
        const rect = img.getBoundingClientRect()
        console.log(rect.width, rect.height)
    }

    const getImageCoordinates = (e) => {
        const img = gameAreaRef.current;
        const rect = img.getBoundingClientRect()

        const scaleX = img.naturalWidth / rect.width;
        const scaleY = img.naturalHeight / rect.height;
        
        // Get the click position relative to the canvas and adjust for scaling
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        //console.log(`Click coordinates: \nX: ${x} \nY: ${y}`);
        return [x, y]
    }

    const handleMouseDown = (e) => {
        //left click only
        if (e.button !== 0) return

        dragged.current = false
        lastPositionRef.current = {
          x: e.clientX,
          y: e.clientY
        };
        draggableTimer.current = setTimeout(() => {
            isHoldingRef.current = true;
        }, 200)
    }

    const handleMouseUp = (e) => {
        isHoldingRef.current = false;
        clearTimeout(draggableTimer.current)
        draggableTimer.current = null;
        if (!dragged.current) {
            let [x, y] = getImageCoordinates(e)
            setSelect({top: lastPositionRef.current.y - 50, left: lastPositionRef.current.x - 30, display: 'block'})
            console.log(`Click coordinates: \nX: ${x} \nY: ${y}`);
        }
        dragged.current = false
    }

    const handleMouseLeave = (e) => {
        isHoldingRef.current = false;
        clearTimeout(draggableTimer.current)
        draggableTimer.current = null;
    }

    const handleMouseMove = (e) => {
        if(isHoldingRef.current) {
            dragged.current = true
            const deltaX = e.clientX - lastPositionRef.current.x;
            const deltaY = e.clientY - lastPositionRef.current.y;
            
            setTranslateX(prev => prev + deltaX);
            setTranslateY(prev => prev + deltaY);
            
            lastPositionRef.current = {
              x: e.clientX,
              y: e.clientY
            };
        }
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


    return (
        <>
        <button onClick={zoomIn}>zoom in</button>
        <button onClick={zoomOut}>zoom out</button>
        <button onClick={calculaterMinScale}>log</button>
        <div className="img-container" ref={imgContainer}>
            <div className="img-wrapper">
                <img 
                ref={gameAreaRef} 
                src={gameImage} 
                alt="waldo game" 
                className='game-img' 
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
    )
}

export default Game