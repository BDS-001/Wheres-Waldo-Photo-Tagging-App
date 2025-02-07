/* eslint-disable react/prop-types */
export default function GameControls({ onZoomIn, onZoomOut }) {
    return(
    <div className="game-controls">
        <button onClick={onZoomIn}>zoom in</button>
        <button onClick={onZoomOut}>zoom out</button>
    </div>
)};