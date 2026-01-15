import React from "react";
import { useState } from "react";
import { getRandomVerticalValue } from "./Functions";
import { useEffect } from "react";

export function PlayQuestionSVGInteractivePlot({plotIndex, plot, dimensions, isPlotActive, onPlotChange, onMovePoint}){

    const {Id, OriginX , OriginY, Title, Sections} = plot
    
    const {width, height, left, top} = dimensions

    const origin_X = (OriginX/100) * width
    const origin_Y = (OriginY/100) * height

    const svgRef = React.createRef()

    const [offset, setOffset] = useState(20)
    const [topOffset, setTopOffset] = useState(0)
    const [leftOffset, setLeftOffset] = useState(0)

    const[sectionMovingIndex, setSectionMovingIndex] = useState(null)
    const[movingPoint, setMovingPoint] = useState(null)

    useEffect(() => {
        const svgElement = svgRef && svgRef.current
        
        if(svgElement){
            const {top, left} = svgElement.getBoundingClientRect();

            setTopOffset(top)
            setLeftOffset(left)
        }
      }, [svgRef]);

    return(
        <svg 
        ref={svgRef}

        onMouseMove={(e) => {
            if(Object.is(sectionMovingIndex, null)) return;

            const y = (e.clientY - topOffset)
            const x = (e.clientX - leftOffset)

            onMovePoint(sectionMovingIndex, movingPoint, x, y)
        }}

        opacity={isPlotActive? 1:0.5} key={"p"+Id} width={width+2*offset} height={height+4*offset} x={left-offset} y={top-offset}>
            {/* Axis */}
            <line x1={offset} x2={offset+width} y1={offset+height-origin_Y} y2={offset+height-origin_Y} stroke="#cccccc" strokeWidth={2} />
            <line x1={offset+origin_X} x2={offset+origin_X} y1={offset} y2={offset+height} stroke="#cccccc" strokeWidth={2} />
            
            
            {/* Sections */}
            {Sections.map((s, si) => {
                const {Id, x, IsFrozen, c1x, c1y, c2x, c2y, y1, y2} = s 
                const next_s = Sections[si+1]

                const onlyOnePoint = (Object.is(si,0) || Object.is(si,Sections.length - 1))
                const isLastSection = (Object.is(si,Sections.length - 1))

                const sW = (next_s ? next_s.x-s.x : 0) * 0.01 * width 

                return(
                    <svg key={"s"+Id} x={width*0.01*x} y={offset}>
                        {/* Curve */}
                        {!isLastSection && 
                            <path
                                d={`M ${offset} ${offset + 0.01 * y2 * height} C ${offset+0.01 * (c1x-x) * width} ${offset + 0.01 * c1y * height}, ${offset+0.01 * (c2x-x) * width} ${offset + 0.01 * c2y * height}, ${offset + 0.01 * (next_s.x -x) * width} ${offset + 0.01*next_s.y1*height}`}
                                stroke="#006080"
                                fill="transparent" 
                            />} 

                        {IsFrozen && next_s && <rect x={offset+1} y={0} height={height} width={offset+0.01*width*(next_s.x-x)-1} fill="rgb(242, 242, 242)" stroke="transparent"/>}

                        <line x1={offset} x2={offset} y1={0} y2={height} stroke={"#a6a6a6"} strokeWidth={1}/>
                        
                        {/* Draw Points */}
                        {/* p1 */}
                        {!isLastSection && <circle 
                        onClick={() => {
                            const isMoving = Object.is(sectionMovingIndex, si) && Object.is(movingPoint, "y2")

                            if(isMoving){
                                setSectionMovingIndex(null)
                                setMovingPoint(null)
                                return
                            }

                            setSectionMovingIndex(si)
                            setMovingPoint("y2")
                        }}
                        className="hq-clickable" cx={offset} cy={offset + 0.01 * y2 * height} r={4} fill="#a6a6a6" stroke="red" strokeWidth={2} />}

                        {/* p2 */}
                        {(!onlyOnePoint || isLastSection) && <circle 
                        onClick={() => {
                            const isMoving = Object.is(sectionMovingIndex, si) && Object.is(movingPoint, "y1")

                            if(isMoving){
                                setSectionMovingIndex(null)
                                setMovingPoint(null)
                                return
                            }

                            setSectionMovingIndex(si)
                            setMovingPoint("y1")
                        }}
                        className="hq-clickable" cx={offset} cy={offset + 0.01 * y1 * height} r={4} fill="#a6a6a6" stroke="red" strokeWidth={2} />}

                        {/* cp1 */}
                        {!isLastSection && <line x1={offset} x2={offset+0.01 * (c1x-x) * width} y1={offset + 0.01 * y2 * height} y2={offset + 0.01 * c1y * height} stroke="#cccccc" strokeWidth={2} />}
                        {!isLastSection && <circle 
                        onClick={() => {
                            const isMoving = Object.is(sectionMovingIndex, si) && Object.is(movingPoint, "c1x")

                            if(isMoving){
                                setSectionMovingIndex(null)
                                setMovingPoint(null)
                                return
                            }

                            setSectionMovingIndex(si)
                            setMovingPoint("c1")
                        }}
                        className="hq-clickable" cx={offset+0.01 * (c1x-x) * width} cy={offset + 0.01 * c1y * height} r={4} fill="#a6a6a6" stroke="blue" />}

                        {/* cp2 */}
                        {!isLastSection && <line x1={offset+0.01 * (next_s.x -x) * width} x2={offset+0.01 * (c2x-x) * width} y1={offset + 0.01 * next_s.y1 * height} y2={offset + 0.01 * c2y * height} stroke="#cccccc" strokeWidth={2} />}
                        {!isLastSection && <circle 
                        onClick={() => {
                            const isMoving = Object.is(sectionMovingIndex, si) && Object.is(movingPoint, "c2x")

                            if(isMoving){
                                setSectionMovingIndex(null)
                                setMovingPoint(null)
                                return
                            }

                            setSectionMovingIndex(si)
                            setMovingPoint("c2")
                        }}
                        className="hq-clickable" cx={offset+0.01 * (c2x-x) * width} cy={offset + 0.01 * c2y * height} r={4} fill="#a6a6a6" stroke="blue" />}       
                    
                        
                    </svg>
                )
            })}
            
            <text x={width*0.5-Title.length*2.3} y={height+2*offset} fill="#006080">{Title}</text>
            {!isPlotActive && <text x={width*0.5-30} y={height+3*offset} fill="#b3b2b2" className="hq-clickable" onClick={() => onPlotChange(plotIndex)}>activate plot</text>}
        </svg>
    )
}