/* eslint-disable react/prop-types */
const AreaSelect = ({ position }) => {
    return (
      <div
      className="select-area"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          display: `${position.display}`,
          transform: `translate(-50%, -50%) scale(${position.scale})`,
          position: 'absolute'
        }}
      />
    );
  };

export default AreaSelect