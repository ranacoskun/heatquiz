import React from 'react';
import { Rect } from 'react-konva';

function Area({ x, y, width, height, id }) {
  return <Rect x={x} y={y} width={width} height={height} fill="rgba(0,0,0,0.1)" stroke="black" strokeWidth={1} />;
}

export default Area;