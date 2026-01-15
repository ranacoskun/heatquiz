import React, { useEffect, useState } from 'react';
import { Group, Circle, Text, Image, Path,  } from 'react-konva';

function Component({ id, svg, x, y, width, height, inputPoints, outputPoints, onConnectionStart, onConnectionEnd, layerRef }) {
   const [initialPosition, setInitialPosition] = useState({x:0, y:0})

    const [pointRefs, setPointRefs] = useState({})

    useEffect(() => {
        let _refs = {}

        for(const p of inputPoints){
            const {id} = p

            _refs[id] = React.createRef()
        }

        for(const p of outputPoints){
            const {id} = p

            _refs[id] = React.createRef()
        }

        setPointRefs(_refs)
    }, [])

    console.log(pointRefs)
  return (
    
    <Group
    
    x={x} y={y}>
        
      
      {inputPoints && inputPoints.map((point) => (
        <Circle
          ref={pointRefs[point.id]}
          key={point.id}
          x={point.x}
          y={point.y}
          radius={5}
          fill="red"
          draggable
          onDragStart={(e) => {
            e.cancelBubble = true; // Prevent dragging the whole component
            onConnectionStart(id, point.id, x + point.x, y + point.y);
            setInitialPosition({x: point.x, y:point.y})
            console.log(e)
          }}
          onDragEnd={(e) => {
            onConnectionEnd();
           if(layerRef){
                const pointRef = pointRefs[point.id]

                if(pointRef){
                    pointRef.current.position({ ...initialPosition});
                    layerRef.current.draw()
                }
           }
          }}
        />
      ))}

      {outputPoints && outputPoints.map((point) => (
        <Circle
        ref={pointRefs[point.id]}
        key={point.id}
          x={point.x}
          y={point.y}
          radius={5}
          fill="green"
          draggable
          onDragStart={(e) => {
            e.cancelBubble = true; // Prevent dragging the whole component
            onConnectionStart(id, point.id, x + point.x, y + point.y);
            setInitialPosition({x: point.x, y:point.y})
            console.log(e)
          }}
          onDragEnd={(e) => {
            onConnectionEnd(id, point.id, x + point.x, y + point.y);
           if(layerRef){
                const pointRef = pointRefs[point.id]

                if(pointRef){
                    pointRef.current.position({ ...initialPosition});
                    layerRef.current.draw()
                }
           }
          }}
        />
      ))}
    </Group>
   
  );
}

export default Component;