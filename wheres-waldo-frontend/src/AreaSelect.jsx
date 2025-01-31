/* eslint-disable react/prop-types */
const AreaSelect = ({ position }) => {
    return (
      <div
      className="select-area"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          display: `${position.display}`,
          position: 'absolute'
        }}
      />
    );
  };

export default AreaSelect