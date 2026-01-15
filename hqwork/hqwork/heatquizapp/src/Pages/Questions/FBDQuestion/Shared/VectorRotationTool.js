import { Input, Space } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export function VectorRotationTool({onUpdate, currentAngle, wh=wh, noUpdate=false}){
    const svgRef = React.createRef()

    const [isMoving,setIsMoving] = useState(false)
    const [angle, setAngle] = useState(0) 

    const [leftOffset, setLeftOffset] = useState(0)
    const [topOffset, setTopOffset] = useState(0)

    useEffect(() => {
        setAngle(currentAngle)
    }, [])

    useEffect(() => {
        onUpdate(angle)
    }, [angle])

    function renderArrow(x,y,angle){
        const _L = wh*0.38

        return(
            <svg x={x} y={y-6} transform={`rotate(${-angle}, ${x}, ${y})`}>
                <path fill={"red"} d= {`M0 4 L0 8 L${_L} 8 L${_L} 12 L${_L+12} 6 L${_L} 0 L${_L} 4 z`}/>
            </svg>
        )
    }

    useEffect(() => {
        const svgElement = svgRef && svgRef.current
        
        if(svgElement){
            const {top, left} = svgElement.getBoundingClientRect();

            setTopOffset(top)
            setLeftOffset(left)
        }
      }, [svgRef]);

    return(
        <div>
            <Space direction="vertical"  >
            <svg  width={wh} height={wh} >
                <svg 
                    ref={svgRef}
                    width={wh} height={wh} 

                    style={{cursor:isMoving ? 'crosshair' : 'pointer'}}

                    onClick={() => {
                        if(noUpdate) return;

                        if(!isMoving){
                            setIsMoving(true)
                            return;
                        }
                        else{
                            setIsMoving(false)
                        }
                    }}

                    onMouseMove={(e) => {
                        if(noUpdate) return;
                        if(!isMoving) return;

                        const y = (e.clientY - topOffset - wh*0.5)
                        const x = (e.clientX - leftOffset - wh*0.5)

                        const _angle = (180/Math.PI) * Math.atan2(y, x)
                
                        setAngle((-parseInt(_angle)) || 0)
                    }}
                    >
                        <circle cx={wh*0.5} cy={wh*0.5} r={wh*0.46} fill="rgba(255,0,0,0.1)" stroke="rgba(255,0,0,0.75)"/> 
                        <circle cx={wh*0.5} cy={wh*0.5} r={3} fill="rgba(255,0,0,1)" stroke="transparent"/> 

                        <line x1={wh*0.5} y1={wh*0.5} x2={wh*0.5} y2={0} stroke="rgba(0,0,0,0.2)" strokeWidth={1}/> 
                        <line x1={wh*0.5} y1={wh*0.5} x2={0} y2={wh*0.5} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                        <line x1={wh*0.5} y1={wh} x2={wh*0.5} y2={wh*0.5} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                        <line x1={wh*0.5} y1={wh*0.5} x2={wh} y2={wh*0.5} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />

                        <line x1={wh*0.5} y1={wh*0.5} x2={wh*0.5 + wh*0.46*Math.cos(Math.PI*(1/6))} y2={wh*0.5 + wh*0.46*Math.sin(Math.PI*(1/6))} stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray={5}/> 
                        <line x1={wh*0.5} y1={wh*0.5} x2={wh*0.5 + wh*0.46*Math.cos(Math.PI*(1/3))} y2={wh*0.5 + wh*0.46*Math.sin(Math.PI*(1/3))} stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray={5}/> 
                        
                        <line x1={wh*0.5} y1={wh*0.5} x2={wh*0.5 + wh*0.46*Math.cos(Math.PI*(2/3))} y2={wh*0.5 + wh*0.46*Math.sin(Math.PI*(2/3))} stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray={5}/> 
                        <line x1={wh*0.5} y1={wh*0.5} x2={wh*0.5 + wh*0.46*Math.cos(Math.PI*(5/6))} y2={wh*0.5 + wh*0.46*Math.sin(Math.PI*(5/6))} stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray={5}/> 
                        
                        <line x1={wh*0.5} y1={wh*0.5} x2={wh*0.5 + wh*0.46*Math.cos(Math.PI*(7/6))} y2={wh*0.5 + wh*0.46*Math.sin(Math.PI*(7/6))} stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray={5}/> 
                        <line x1={wh*0.5} y1={wh*0.5} x2={wh*0.5 + wh*0.46*Math.cos(Math.PI*(8/6))} y2={wh*0.5 + wh*0.46*Math.sin(Math.PI*(8/6))} stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray={5}/> 
                        
                        <line x1={wh*0.5} y1={wh*0.5} x2={wh*0.5 + wh*0.46*Math.cos(Math.PI*(10/6))} y2={wh*0.5 + wh*0.46*Math.sin(Math.PI*(10/6))} stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray={5}/> 
                        <line x1={wh*0.5} y1={wh*0.5} x2={wh*0.5 + wh*0.46*Math.cos(Math.PI*(11/6))} y2={wh*0.5 + wh*0.46*Math.sin(Math.PI*(11/6))} stroke="rgba(0,0,0,0.2)" strokeWidth={1} strokeDasharray={5}/> 


                        {renderArrow(wh*0.5, wh*0.5, angle)}
                    </svg>
            </svg>
            <Input 
                style={{width:wh}} 

                type="number"
                min={-360}
                max={360}
                value={angle} 
                disabled={noUpdate}
                onChange={(v) => {
                    let value = v.target.value
                    value = parseInt(Math.max(-360, Math.min(value, 360)))

                    setAngle(value)
                }}
                suffix="°"
            />
            </Space>
        </div>
    )
}