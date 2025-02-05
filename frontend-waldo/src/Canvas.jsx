import { useEffect, useRef, useState } from 'react';

function Canvas() {
    const canvasRef = useRef(null)
    const [selectData, setSelectData] = useState(null)
    const selectWidth = 50
    const selectHeight = 50

    //set canvas size
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 800;
        canvas.height = 600;
    }, [])

    //draw selection square when data is updated
    useEffect(() => {
        if (!selectData) return
        const ctx = canvasRef.current.getContext('2d')
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.strokeRect(...selectData);
    }, [selectData]);

    const getCoordinates = (clientX, clientY) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect()

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        // Get the click position relative to the canvas and adjust for scaling
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        
        console.log(`Canvas coordinates: \nX: ${x} \nY: ${y}`);
        return [x, y]
    }
    const drawSquare = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvasRef.current.getContext('2d')
        const [x, y] = getCoordinates(e.clientX, e.clientY)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        setSelectData([x - (selectWidth/2), y - (selectHeight/2), selectWidth, selectHeight])
    }

    return (
        <canvas ref={canvasRef} onClick={drawSquare}></canvas>
    )
}

export default Canvas