import { Tooltip } from "antd";
import React from "react";

export function MomentDirectionComponent({clockwise, onFlip}){

    return(
       <Tooltip
            color="white"
            title = {<p>Click to flip direction</p>}
       >
         <p 
        onClick={() => onFlip()}
        className="default-green default-x-larger hq-clickable">{clockwise ? "↻" : "↺"}</p>
       </Tooltip>
    )
}