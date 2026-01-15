import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DEFAULT_CONNECTION_LINE_COLOR, DEFAULT_CONNECTION_LINE_STROKE_WIDTH, DEFAULT_DASHED_COLOR, DEFAULT_SLIDER_DOT_COLOR, DEFAULT_TIP_SIZE, N_STEPS } from "./Constants";

export function ClickableChartComponent({style, onUpdateSliderValue, slidersValues}){


    const [cursorType, setCursorType] = useState('default')
    const [offset, setOffset] = useState(0)
    const {width, height} = style

    const canvasRef = React.createRef()
    const [ctx, setCtx] = useState(null)

    const [pointsData, setPointsData] = useState({
        firstPoint:[/*x, y, size*/],
        firstPoint_base:[],

        secondPoint:[/*x, y, size */],
        secondPoint_base:[],

        thirdPoint:[/*x, y, size */],
        thirdPoint_base:[],

        middlePoint: [/*x, y, size */],

        controlledPoint: 'firstPoint',
        movedPoint: null,
        tipPoint: null,

        clickablePoints: ['firstPoint', 'secondPoint', 'thirdPoint'],
        clickableAreaPoints: ['firstPoint_base', 'secondPoint_base', 'thirdPoint_base'],
        VerticalPoints: ['firstPoint', 'secondPoint', 'thirdPoint'],
        IsMovingPoint:false,

        indexMapping:{
            firstPoint:0,
            secondPoint:1,
            thirdPoint:2,
        },
    })

    useEffect(() => {
        if(canvasRef && !ctx){
            let ctx = canvasRef.current.getContext('2d')
            setCtx(ctx)

            const _offset = DEFAULT_TIP_SIZE
            setOffset(_offset)


            const firstPoint = [_offset + DEFAULT_TIP_SIZE, _offset + DEFAULT_TIP_SIZE, DEFAULT_TIP_SIZE]
            const firstPoint_base = [...firstPoint]

            const secondPoint = [_offset + width/2, _offset + height/2 , DEFAULT_TIP_SIZE]
            const secondPoint_base = [...secondPoint]

            const thirdPoint = [_offset + width - DEFAULT_TIP_SIZE , _offset + height - DEFAULT_TIP_SIZE, DEFAULT_TIP_SIZE]
            const thirdPoint_base = [...thirdPoint]

            setPointsData(data => ({
                ...data,
                controlPointX: width/2,
                controlPointY: height/2,

                firstPoint: firstPoint,
                firstPoint_base: firstPoint_base,
                
                secondPoint: secondPoint,
                secondPoint_base: secondPoint_base,
                
                thirdPoint: thirdPoint,
                thirdPoint_base: thirdPoint_base,

                middlePoint: [_offset + width/2, _offset + height/2, 0],
            }))

        }
    }, [canvasRef])


    useEffect(() => {
        drawPlot()
    }, [ctx])

    const drawPlot = () => {
        if(!ctx) return;      

        const {firstPoint, secondPoint, thirdPoint, middlePoint} = pointsData;
        const {firstPoint_base, secondPoint_base, thirdPoint_base, tipPoint, movedPoint} = pointsData;

        //clean the drawing 
        ctx.clearRect(0, 0, width + offset * 2, height + offset * 2);

        //draw first point + slider
        drawPoint(firstPoint, DEFAULT_CONNECTION_LINE_COLOR, '#d9d9d9')
        drawSlider(firstPoint_base, height)

        //draw second point
        drawPoint(secondPoint, DEFAULT_CONNECTION_LINE_COLOR, '#d9d9d9')
        drawSlider([secondPoint_base[0], firstPoint_base[1], secondPoint_base[2]], height)

        //draw third point
        drawPoint(thirdPoint, DEFAULT_CONNECTION_LINE_COLOR, '#d9d9d9')    
        drawSlider([thirdPoint_base[0], firstPoint_base[1], thirdPoint_base[2]], height)

        //connect lines
        drawLine(firstPoint, secondPoint)
        drawLine(middlePoint, thirdPoint)
        drawMiddleLine(secondPoint, middlePoint)

        //draw x axis
        drawAxes()

        if(tipPoint){
            drawTipLine(pointsData[movedPoint], tipPoint, 'orange')
        }
        
    }

    const drawPoint = (point, color, fillColor) => {
        if(!ctx) return;      
    
        ctx.beginPath();
        ctx.arc(point[0], point[1], point[2], 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.stroke();
    
        ctx.beginPath();
        ctx.arc(point[0], point[1], DEFAULT_TIP_SIZE*0.3, 0, 2 * Math.PI);
        ctx.strokeStyle = DEFAULT_CONNECTION_LINE_COLOR;
        ctx.fillStyle = DEFAULT_CONNECTION_LINE_COLOR;
        ctx.fill();
        ctx.stroke();
    }

    const drawSlider = (point, length) => {
        if(!ctx) return;  

        const step = (length - 2*point[2])/N_STEPS

        for(let i = 0; i < (step+1); i++){
            ctx.beginPath();
            ctx.arc(point[0], point[1] + i * step, DEFAULT_TIP_SIZE*0.15, 0, 2 * Math.PI);
            ctx.strokeStyle = DEFAULT_SLIDER_DOT_COLOR
            ctx.fillStyle = DEFAULT_SLIDER_DOT_COLOR;
            ctx.fill();
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(point[0], point[1]);
        ctx.lineTo(point[0], length);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';

        ctx.stroke();
    }

    const drawLine = (startPoint, endPoint, alignmentColor = DEFAULT_DASHED_COLOR) => {
        if(!ctx) return;      

        const isHorizontal = (startPoint[1] === endPoint[1])

        ctx.beginPath();

        ctx.moveTo(...startPoint);
        ctx.lineTo(...endPoint);

        ctx.strokeStyle = (isHorizontal) ? alignmentColor : DEFAULT_CONNECTION_LINE_COLOR;
        ctx.lineWidth = DEFAULT_CONNECTION_LINE_STROKE_WIDTH 

        ctx.stroke();
        ctx.setLineDash([])
    }

    const drawAxes = () => {
        if(!ctx) return;      

        //x-axis
        ctx.beginPath();

        ctx.moveTo(0, offset + height/2);
        ctx.lineTo(2*offset + width, offset + height/2);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
        ctx.lineWidth = 1;

        ctx.stroke();
    }

    const drawMiddleLine = (startPoint, endPoint) => {
        if(!ctx) return;      

        ctx.beginPath();

        ctx.moveTo(...startPoint);
        ctx.lineTo(...endPoint);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = DEFAULT_CONNECTION_LINE_STROKE_WIDTH 

        ctx.stroke();
        ctx.setLineDash([])
    }

    const drawTipLine = (startPoint, endPoint, alignmentColor = DEFAULT_DASHED_COLOR) => {
        if(!ctx) return;      

        ctx.beginPath();

        ctx.moveTo(...startPoint);
        ctx.lineTo(...endPoint);

        ctx.strokeStyle = alignmentColor ;
        ctx.lineWidth = DEFAULT_CONNECTION_LINE_STROKE_WIDTH 

        ctx.stroke();
        ctx.setLineDash([])
    }
    
    const handleMouseMove = (e) => {
        const point = computePointInCanvas(e);
        console.log(point)
        const hoverPoint = setCursorAsPointer(point)
        console.log(hoverPoint)

        const {movedPoint} = pointsData
        
        if(hoverPoint || movedPoint){
            setPointsData(data => ({
                ...data,
                controlledPoint: hoverPoint,
            }))

            setCursorType('pointer')

            if(movedPoint){
                let newPoint = pointsData[movedPoint] 

                newPoint[1] =  point.y

                let data = ({...pointsData})
                data[movedPoint] = newPoint

                const range = height - 2*offset
                const step = (range)/N_STEPS
    
                const position = Math.floor(point.y/step) * step + 2*offset

                data.tipPoint = [data[movedPoint][0], position, data[movedPoint][2]]


                setPointsData(d => ({
                    ...d,
                    ...data,
                }))
                
                drawPlot()
            }
        }
        else{

            setPointsData(data => ({
                ...data,
                controlledPoint: null,

            }))

            setCursorType('default')
        }
    }


    const handleMouseClick = (e) => {
        const {controlledPoint, movedPoint, indexMapping} = pointsData
        let position = 0

        
        if(!movedPoint && controlledPoint){
            setPointsData(data => ({
                ...data,
                movedPoint: controlledPoint
            }))

            return
        }

        if(controlledPoint){

            const point = computePointInCanvas(e);
            const range = height - 2*offset
            const sliderRange = height
            const step = (range)/N_STEPS

            position = Math.floor(point.y/step) * step + 2*offset
            let data = ({...pointsData})

            data[controlledPoint][1] = position

            setPointsData(d => ({
                ...d,
                ...data,
                movedPoint: null,
                tipPoint: null
            }))

            drawPlot()

            if(onUpdateSliderValue){
                const index = indexMapping[controlledPoint] 

                let _slidersValues = [...slidersValues]

                _slidersValues[index] =  sliderRange/2 - position + offset

                onUpdateSliderValue(_slidersValues)
            }
        }

    }

    console.log(pointsData)
    

    const computePointInCanvas = (e) => {
        const {clientX, clientY} = e
        const boundingRect = canvasRef.current.getBoundingClientRect();

        return {
            x: Math.floor(clientX - boundingRect.left),
            y: Math.floor(clientY - boundingRect.top)
        }
    }

    const setCursorAsPointer = (mousePosition) => {
        const {clickableAreaPoints} = pointsData

        for(let clickablePoint of clickableAreaPoints){

            let coordinates = getCoordinatesSlider(clickablePoint)
            if(checkPointInsideRect(mousePosition, coordinates)){
                return clickablePoint.replace('_base', '')
            }
        }

        return null
    }

    const getCoordinatesSlider = (pointName) => {
        const data = pointsData[pointName]
        const {firstPoint_base} = pointsData

        // x - size, x + size, y - size, y + size
        return({
            x1: data[0] - data[2],
            x2: data[0] + data[2],
            y1: firstPoint_base[1] - data[2] ,
            y2: firstPoint_base[1]- data[2] + height
        })
    }

    const checkPointInsideRect = (point, rect) => {
        return(point.x > rect.x1 && point.x < rect.x2 && point.y > rect.y1 && point.y < rect.y2)
    }

    return(
        <div>
           <div 
           >
                <div>
                    <canvas
                    className="clickable-question-play-chart-component-base"
                        style = {{
                            ...style,
                            cursor: cursorType,
                            height:height + offset * 2,
                            width:width + offset * 2
                        }}

                        width = {width + offset * 2}
                        height = {height + offset * 2}

                        ref = {canvasRef}

                        onMouseMove = {handleMouseMove}
                        onMouseLeave = {() => setCursorType('default')}
                        onClick = {handleMouseClick}
                    />
                </div>
            </div>
        </div>
    )
} 