import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Group, Circle, Image } from 'react-konva';
import Component from './Component';
import Area from './Area';
import Connection from './Connection'; // Import the Connection component

function Board({width, height, backgroundImage, components, areas }) {
  const [boardComponents, setBoardComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newConnection, setNewConnection] = useState(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if(components && components.length){
        setBoardComponents([...components])
    }
  },[])

  const handleDrop = (e) => {
    e.preventDefault();
    const componentData = JSON.parse(e.dataTransfer.getData('component'));
    const stage = stageRef.current.getStage();
    stage.setPointersPositions(e);
    const pointerPosition = stage.getPointerPosition();
    // Check if the component fits inside any area
    let fitsInArea = true;
    for (const area of areas) {
    continue

      if (
        pointerPosition.x >= area.x &&
        pointerPosition.x + componentData.width <= area.x + area.width &&
        pointerPosition.y >= area.y &&
        pointerPosition.y + componentData.height <= area.y + area.height
      ) {
        fitsInArea = true;
        break;
      }
    }
    console.log(componentData)
    if (fitsInArea) {
      setBoardComponents([...boardComponents, { ...componentData, x: pointerPosition.x, y: pointerPosition.y, id: Date.now().toString() }]); // Assign unique ID
    } else {
      alert('Component must be placed inside an area.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleConnectionStart = (componentId, pointId, x, y) => {
    setIsDrawing(true);
    setNewConnection({ fromX: x, fromY: y, toX: x, toY: y, fromComponentId: componentId, fromPointId: pointId });
  };

  const handleConnectionEnd = (componentId, pointId, x, y) => {
    setIsDrawing(false);
    /*if (newConnection) {
      setConnections([...connections, { ...newConnection, toX: x, toY: y, toComponentId: componentId, toPointId: pointId, id: Date.now().toString() }]);
      setNewConnection(null);
    }*/

    setNewConnection(null);

  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !newConnection) return;
    const stage = stageRef.current.getStage();
    const pointerPosition = stage.getPointerPosition();
    setNewConnection({ ...newConnection, toX: pointerPosition.x, toY: pointerPosition.y });
  };
  console.log(newConnection, connections)
  return (
    <div
      style={{ width, height, border: '1px solid blue' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
    >
      <Stage width={width} height={height} ref={stageRef}>
        <Layer ref={layerRef}>
        {/* Background Image */}
          {backgroundImage && (
            <Image
              image={backgroundImage}
              width={800} // Or the desired width
              height={600} // Or the desired height
            />
          )}
          {areas.map((area) => (
            <Area key={area.id} {...area} />
          ))}
          {boardComponents.map((component) => (
            <Component
              key={component.id}
              {...component}
              layerRef={layerRef}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
            />
          ))}
          {/* Render Connections here */}
          {connections.map((connection) => (
            <Connection key={connection.id} fromX={connection.fromX} fromY={connection.fromY} toX={connection.toX} toY={connection.toY} />
          ))}
          {isDrawing && newConnection && (
            <Connection fromX={newConnection.fromX} fromY={newConnection.fromY} toX={newConnection.toX} toY={newConnection.toY} />
          )}
        </Layer>
        
      </Stage>
    </div>
  );
}

export default Board;