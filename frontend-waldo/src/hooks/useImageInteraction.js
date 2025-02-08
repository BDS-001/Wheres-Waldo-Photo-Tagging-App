import { useRef, useState, useEffect } from 'react';

export const useImageInteraction = (updatePosition, scale, translateX, translateY, gameAreaRef, imgContainerRef) => {
    const isHoldingRef = useRef(false);
    const dragged = useRef(false);
    const draggableTimer = useRef(null);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const [select, setSelect] = useState({
        top: 0,
        left: 0,
        width: '50px',
        height: '50px',
        display: 'none',
        scale: scale
    });

    // Update selection scale when image scale changes
    useEffect(() => {
        setSelect(prev => ({...prev, scale}));
    }, [scale]);

    // Reset selection when transform changes
    useEffect(() => {
        setSelect(prev => ({...prev, display: 'none'}));
    }, [scale, translateX, translateY]);

    const getImageCoordinates = (e) => {
        const img = gameAreaRef.current;
        const rect = img.getBoundingClientRect();

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
        return [x, y];
    };

    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        dragged.current = false;
        lastPositionRef.current = { x: e.clientX, y: e.clientY };
        draggableTimer.current = setTimeout(() => {
            isHoldingRef.current = true;
        }, 200);
    };

    const handleMouseUp = (e) => {
        isHoldingRef.current = false;
        clearTimeout(draggableTimer.current);
        draggableTimer.current = null;
        if (!dragged.current) {
            const [x, y] = getImageCoordinates(e);
            const rect = imgContainerRef.current.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;
            
            setSelect(prev => ({
                ...prev,
                top: relativeY,
                left: relativeX,
                display: 'block',
                scale: scale
            }));
            console.log(`Click coordinates: \nX: ${x} \nY: ${y}`);
        }
        dragged.current = false;
    };

    const handleMouseLeave = () => {
        isHoldingRef.current = false;
        clearTimeout(draggableTimer.current);
        draggableTimer.current = null;
    };

    const handleMouseMove = (e) => {
        if (isHoldingRef.current) {
            dragged.current = true;
            const deltaX = e.clientX - lastPositionRef.current.x;
            const deltaY = e.clientY - lastPositionRef.current.y;
            updatePosition(deltaX, deltaY);
            lastPositionRef.current = { x: e.clientX, y: e.clientY };
            // Hide selection when dragging
            setSelect(prev => ({...prev, display: 'none'}));
        }
    };

    return {
        select,
        setSelect,
        handleMouseDown,
        handleMouseUp,
        handleMouseLeave,
        handleMouseMove,
        getImageCoordinates
    };
};