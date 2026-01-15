import { Divider, Space } from 'antd';
import React from 'react';

function AppComponentList({ components, onComponentDragStart }) {
  return (
    <div>
      <Space>
      {components && components.map((component) => (
        <div
          key={component.id}
          draggable
          onDragStart={(e) =>{
            // Package the component data
            const data = JSON.stringify(component); // Convert to JSON string
            e.dataTransfer.setData('component', data); // Set the data
            if(onComponentDragStart)onComponentDragStart(e, component); // Call the handler (optional)
          }}
          
          className='hq-element-container hq-grabbable'
        >
          <div dangerouslySetInnerHTML={{ __html: component.svg }} />
          <small className='default-gray'>{component.name}</small>

        </div>
      ))}
      </Space>
      <Divider />
    </div>
  );
}

export default AppComponentList;