/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import gameImage from './assets/waldogame.png'
import AreaSelect from './AreaSelect'

function Game() {
    // Refs for DOM elements and interaction states
    const gameAreaRef = useRef(null)
    const imgContainerRef = useRef(null)
    const isHoldingRef = useRef(false)
    const dragged = useRef(false)
    const draggableTimer = useRef(null)
    const lastPositionRef = useRef({ x: 0, y: 0 })

    // State for image transformation
    const [scale, setScale] = useState(0.1)
    const [translateX, setTranslateX] = useState(0)
    const [translateY, setTranslateY] = useState(0)
    const [select, setSelect] = useState({
        top: 0, 
        left: 0, 
        width: '50px', 
        height:'50px', 
        display: 'none', 
        scale: '1'
    });

    // Constants and constraints
    const SCALE_VAL = 0.1;
    const [minScale, setMinScale] = useState(0.2)
    const [maxScale, setMaxScale] = useState(4);
    const [offsetLimits, setOffsetLimits] = useState({xOffset: 0, yOffset: 0})

    //General Functions
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
 
    const updatePosition = useCallback((valX, valY) => {
        setTranslateX(prev => clamp(prev + valX, offsetLimits.xOffset, 0));
        setTranslateY(prev => clamp(prev + valY, offsetLimits.yOffset, 0));
    }, [offsetLimits])

    const getImageCoordinates = (e) => {
        const img = gameAreaRef.current;
        const rect = img.getBoundingClientRect()

        const scaleX = img.naturalWidth / rect.width;
        const scaleY = img.naturalHeight / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        console.log(`
Image Details:
-------------
Natural Width: ${img.naturalWidth}px
Natural Height: ${img.naturalHeight}px

Current Display:
--------------
Displayed Width: ${rect.width.toFixed(2)}px
Displayed Height: ${rect.height.toFixed(2)}px
Image Left Position: ${rect.left.toFixed(2)}px
Image Top Position: ${rect.top.toFixed(2)}px

Scale Factors:
-------------
Scale X: ${scaleX.toFixed(3)}
Scale Y: ${scaleY.toFixed(3)}

Click Position:
-------------
Client X: ${e.clientX}
Client Y: ${e.clientY}
Relative to Image X: ${(e.clientX - rect.left).toFixed(2)}
Relative to Image Y: ${(e.clientY - rect.top).toFixed(2)}

Final Coordinates:
---------------
Original Image X: ${x.toFixed(2)}
Original Image Y: ${y.toFixed(2)}
            `);
        return [x, y]
    }

    // Effect 1: Initial setup - Calculate initial scale values
    useEffect(() => {
        const calculaterScaleValues = () => {
            const img = gameAreaRef.current;
            const container = imgContainerRef.current.getBoundingClientRect()
            const scaleX = container.width / img.naturalWidth;
            const scaleY = container.height / img.naturalHeight;
            
            const min = Math.max(scaleX, scaleY)
            
            setMinScale(min)
            setMaxScale(min + (SCALE_VAL * 5))
            setScale(min)
        }
        calculaterScaleValues()
    }, [])

    // Effect 2: Update transform when scale or position changes
    useEffect(() => {
        const img = gameAreaRef.current
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
    }, [scale, translateX, translateY])

    // Effect 3: Update offset limits and selection scale when scale changes
    useEffect(() => {
        const img = gameAreaRef.current;
        const container = imgContainerRef.current.getBoundingClientRect();
        
        // Calculate the scaled dimensions without translation influence
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        
        // Calculate the limits based on scaled size vs container
        const xOffset = Math.min(container.width - scaledWidth, 0);
        const yOffset = Math.min(container.height - scaledHeight, 0);
        
        setOffsetLimits({xOffset, yOffset});
        setSelect(prev => ({...prev, scale:scale}))
    }, [scale])

    // Effect 4: Reset selection display when transform changes
    useEffect(() => {
        setSelect(prev => ({...prev, display: 'none'}))
    }, [scale, translateX, translateY]);

    // Effect 5: Update position when offset limits change
    useEffect(() => updatePosition(0,0), [offsetLimits, updatePosition])

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


    //Event Functions
    const handleMouseUp = (e) => {
        isHoldingRef.current = false;
        clearTimeout(draggableTimer.current)
        draggableTimer.current = null;
        if (!dragged.current) {
            let [x, y] = getImageCoordinates(e)
            const rect = imgContainerRef.current.getBoundingClientRect();
        
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;
            
            setSelect(prev => ({
                ...prev,
                top: relativeY,
                left: relativeX,
                display: 'block'
            }));
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

            updatePosition(deltaX, deltaY)
            
            lastPositionRef.current = {
              x: e.clientX,
              y: e.clientY
            };
        }
    }

    const zoomIn = (e) => {
        const newScale = Math.min(scale + SCALE_VAL, maxScale);
        if (newScale !== scale) {
            setScale(newScale)
            console.log('ZOOM IN ','scale:', scale, 'min:', minScale)
        }
    }

    const zoomOut = (e) => {
        const newScale = Math.max(scale - SCALE_VAL, minScale);
        if (newScale !== scale) {
            setScale(newScale)
            console.log('ZOOM IN ','scale:', scale, 'min:', minScale)
        }
    }


    return (
        <>
        <div className="game-controls">
            <button onClick={zoomIn}>zoom in</button>
            <button onClick={zoomOut}>zoom out</button>
        </div>
        <div className="img-container" ref={imgContainerRef}>
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