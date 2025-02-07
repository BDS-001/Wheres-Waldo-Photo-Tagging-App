import { useRef, useState, useEffect } from 'react';

export const useImageInteraction = (updatePosition, scale, translateX, translateY) => {
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
            const rect = e.currentTarget.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;
            setSelect(prev => ({
                ...prev,
                top: relativeY,
                left: relativeX,
                display: 'block',
                scale: scale
            }));
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
        }
    };

    return {
        select,
        setSelect,
        handleMouseDown,
        handleMouseUp,
        handleMouseLeave,
        handleMouseMove
    };
};