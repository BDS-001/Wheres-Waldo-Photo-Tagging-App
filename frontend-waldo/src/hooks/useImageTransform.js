import { useState, useEffect, useCallback } from 'react';

export const useImageTransform = (gameAreaRef, imgContainerRef, SCALE_VAL = 0.1) => {
    const [scale, setScale] = useState(0.1);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [minScale, setMinScale] = useState(0.2);
    const [maxScale, setMaxScale] = useState(4);
    const [offsetLimits, setOffsetLimits] = useState({ xOffset: 0, yOffset: 0 });

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const updatePosition = useCallback((valX, valY) => {
        setTranslateX(prev => clamp(prev + valX, offsetLimits.xOffset, 0));
        setTranslateY(prev => clamp(prev + valY, offsetLimits.yOffset, 0));
    }, [offsetLimits]);

    // Calculate initial scale values
    useEffect(() => {
        const calculateScaleValues = () => {
            const img = gameAreaRef.current;
            const container = imgContainerRef.current.getBoundingClientRect();
            const scaleX = container.width / img.naturalWidth;
            const scaleY = container.height / img.naturalHeight;
            
            const min = Math.max(scaleX, scaleY);
            setMinScale(min);
            setMaxScale(min + (SCALE_VAL * 6));
            setScale(min);
        };
        calculateScaleValues();
    }, [SCALE_VAL, gameAreaRef, imgContainerRef]);

    // Update transform
    useEffect(() => {
        const img = gameAreaRef.current;
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }, [scale, translateX, translateY, gameAreaRef]);

    // Update offset limits
    useEffect(() => {
        const img = gameAreaRef.current;
        const container = imgContainerRef.current.getBoundingClientRect();
        
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        
        const xOffset = Math.min(container.width - scaledWidth, 0);
        const yOffset = Math.min(container.height - scaledHeight, 0);
        
        setOffsetLimits({ xOffset, yOffset });
    }, [scale, gameAreaRef, imgContainerRef]);

    // Update position when offset limits change
    useEffect(() => updatePosition(0, 0), [offsetLimits, updatePosition]);

    

    const zoomIn = () => {
        setScale(prev => Math.min(prev + SCALE_VAL, maxScale));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(prev - SCALE_VAL, minScale));
    };

    return {
        scale,
        translateX,
        translateY,
        updatePosition,
        zoomIn,
        zoomOut
    };
};