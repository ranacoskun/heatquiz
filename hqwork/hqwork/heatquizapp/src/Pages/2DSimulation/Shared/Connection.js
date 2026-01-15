import React from 'react';
import { Line } from 'react-konva';

function Connection({ fromX, fromY, toX, toY }) {
  return (
    <Line
      points={[fromX, fromY, toX, toY]}
      stroke="blue"
      strokeWidth={2}
    />
  );
}

export default Connection;